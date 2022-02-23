package com.tsolution._3services.report;

import java.io.InputStream;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFDataFormat;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;

import com.tsolution.utils.Utils;

public class DynamicHeader {
	private static final String STYLE_BY_GROUP = "G1";
	private static final int ROW_FIX_FROM = 3;
	private static final String TEMPLATE_FILE = "templates/style.xlsx";

	private static Map<Integer, XSSFCellStyle> createStyle(Workbook wb) {
		Map<Integer, XSSFCellStyle> styles = new HashMap<>();
		XSSFDataFormat fmt = (XSSFDataFormat) wb.createDataFormat();
		XSSFCellStyle headerPinkStyle = (XSSFCellStyle) wb.createCellStyle();
		XSSFFont headerPinkFont = (XSSFFont) wb.createFont();

		headerPinkFont.setBold(true);
		headerPinkStyle.setFillForegroundColor(new XSSFColor(new java.awt.Color(217, 151, 149)));
		headerPinkStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerPinkStyle.setFont(headerPinkFont);
		headerPinkStyle.setAlignment(HorizontalAlignment.CENTER);
		headerPinkStyle.setWrapText(true);
		ExcelPOIUtils.setBorderForCell(headerPinkStyle);
		styles.put(0, headerPinkStyle);

		XSSFCellStyle headerGreenStyle = (XSSFCellStyle) wb.createCellStyle();
		XSSFFont headerGreenFont = (XSSFFont) wb.createFont();
		headerGreenFont.setBold(true);
		headerGreenStyle.setFillForegroundColor(new XSSFColor(new java.awt.Color(146, 208, 80)));
		headerGreenStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerGreenStyle.setFont(headerGreenFont);
		headerGreenStyle.setAlignment(HorizontalAlignment.CENTER);
		headerGreenStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		headerGreenStyle.setWrapText(true);
		ExcelPOIUtils.setBorderForCell(headerGreenStyle);
		styles.put(1, headerGreenStyle);

		XSSFCellStyle taFloatGroup23 = (XSSFCellStyle) wb.createCellStyle();
		taFloatGroup23.setAlignment(HorizontalAlignment.RIGHT);
		taFloatGroup23.setFillForegroundColor(new XSSFColor(new java.awt.Color(0, 204, 255)));
		taFloatGroup23.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		taFloatGroup23.setDataFormat(fmt.getFormat("#,###0.00"));
		taFloatGroup23.setFont(headerPinkFont);
		ExcelPOIUtils.setBorderForCell(taFloatGroup23);
		styles.put(2, taFloatGroup23);

		XSSFCellStyle group13 = (XSSFCellStyle) wb.createCellStyle();
		group13.setAlignment(HorizontalAlignment.RIGHT);
		group13.setFillForegroundColor(new XSSFColor(new java.awt.Color(83, 141, 213)));
		group13.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		group13.setDataFormat(fmt.getFormat("0.0%"));

		ExcelPOIUtils.setBorderForCell(group13);
		styles.put(3, group13);

		return styles;
	}

	// generate cot dong bat dau tu countCol
	public static void createHeader361(ResultSet rsHeader, Workbook resultWorkbook, Sheet sheetData, int countCol,
			int fromRow, List<org.apache.poi.ss.usermodel.CellStyle> cellStyles) throws Exception {
		ResultSetMetaData rsMeta = rsHeader.getMetaData();
		rsMeta.getColumnCount();
		Map<Integer, XSSFCellStyle> styles = DynamicHeader.createStyle(resultWorkbook);

		int nRow = fromRow - 2;
		int cell = countCol;
		int i = 0;

		while (rsHeader.next()) {

			ExcelPOIUtils.addCellsAndMerged(sheetData, cell, nRow, cell + 3, nRow, rsHeader.getString(1),
					styles.get(i));
			ExcelPOIUtils.addCell(sheetData, cell++, nRow + 1, "CHỈ TIÊU THÁNG", styles.get(i));
			cellStyles.add(styles.get(2));
			ExcelPOIUtils.addCell(sheetData, cell++, nRow + 1, "Thực hiện ngày", styles.get(i));
			cellStyles.add(styles.get(2));
			ExcelPOIUtils.addCell(sheetData, cell++, nRow + 1, "∑ THỰC HIỆN CD", styles.get(i));
			cellStyles.add(styles.get(2));
			ExcelPOIUtils.addCell(sheetData, cell++, nRow + 1, "TỶ LỆ %", styles.get(i));
			cellStyles.add(styles.get(3));

			i++;
			i = i > 1 ? 0 : i;

		}
	}

	// định nghĩa lại sheet headerTemplate
	// row0: group style
	// row1: cellStyle, fix cứng 3 loại: cell0: String, cell1: number, cell2:
	// percent
	// row2: sumStyle: cell0: sumStyle cho dong tổng 0, cell1: dòng tổng 1, ...
	// row3 ..: các cell cố định phía cuối của report
	private static void createDynamicStyleV2(Workbook resultWorkbook, Sheet shPrivateTemplate,
			Map<Integer, XSSFCellStyle> headerStyle, Map<Integer, Integer> widthCols, List<Integer> styleByGroup,
			Map<Integer, XSSFCellStyle> sumStyles, Map<Integer, XSSFCellStyle> cellStyles) throws Exception {

		InputStream inputStream = null;
		// lay tu file template
		boolean hasPrivateTemplate = true, hasPrivateRowTemplate = true;
		inputStream = new ClassPathResource(DynamicHeader.TEMPLATE_FILE).getInputStream();

		Workbook wbTemplate = new XSSFWorkbook(inputStream);
		Sheet shCommonTemplate = wbTemplate.getSheetAt(0);
		Sheet sheetHeader = shPrivateTemplate;
		if (shPrivateTemplate == null) {
			hasPrivateTemplate = false;

			sheetHeader = shCommonTemplate;
		}

		// row0: định nghĩa group style của các cell (đến khi lặp lại style). neu value
		// la g1, g2, ... thi lap theo nhom
		Row row = sheetHeader.getRow(0);//
		hasPrivateRowTemplate = true;
		System.out.println("check hasPrivateRowTemplate:" + hasPrivateRowTemplate);
		if (row == null) {
			System.out.println("check hasPrivateRowTemplate1:" + hasPrivateRowTemplate);
			hasPrivateRowTemplate = false;
			row = shCommonTemplate.getRow(0);
		}
		int numCols = row.getLastCellNum();
		System.out.println("check hasPrivateRowTemplate2:" + numCols);
		Cell cell = row.getCell(0);
		String value = cell.getStringCellValue();
		System.out.println("check hasPrivateRowTemplate3:" + value);
		if (DynamicHeader.STYLE_BY_GROUP.equalsIgnoreCase(value)) {
			System.out.println("style by group");
			styleByGroup.add(1);
		}
		for (int i = 0; i < numCols; i++) {
			cell = row.getCell(i);
			if (cell == null) {
				System.out.println("i:" + i);
			} else {
				if (hasPrivateTemplate && hasPrivateRowTemplate) {
					headerStyle.put(i, (XSSFCellStyle) cell.getCellStyle());
				} else {
					headerStyle.put(i, (XSSFCellStyle) cell.getCellStyle());
					widthCols.put(i, sheetHeader.getColumnWidth(i));
				}
			}
		}

		// row1: style for dynamic cell:0-String, 1-Number, 2-Percent
		row = sheetHeader.getRow(1);//
		hasPrivateRowTemplate = true;
		System.out.println("check hasPrivateRowTemplate4:");
		if (row == null) {
			hasPrivateRowTemplate = false;
			row = shCommonTemplate.getRow(1);
			System.out.println("check hasPrivateRowTemplate5:");
		}

		numCols = row.getLastCellNum();
		System.out.println("check hasPrivateRowTemplate6:" + numCols);
		for (int i = 0; i < numCols; i++) {
			cell = row.getCell(i);
			if (cell == null) {
				System.out.println("i:" + i);
			} else {
				if (hasPrivateTemplate && hasPrivateRowTemplate) {
					cellStyles.put(i, (XSSFCellStyle) cell.getCellStyle());
				} else {
					headerStyle.put(i, (XSSFCellStyle) cell.getCellStyle());
				}

			}
		}
		// row2: style for sum cell: cell0-sum0, cell1-sum1, ...
		row = sheetHeader.getRow(2);//
		hasPrivateRowTemplate = true;
		if (row == null) {
			hasPrivateRowTemplate = false;
			row = shCommonTemplate.getRow(2);
		}

		numCols = row.getLastCellNum();
		System.out.println("check hasPrivateRowTemplate7:" + numCols);
		for (int i = 0; i < numCols; i++) {
			cell = row.getCell(i);
			if (cell == null) {
				System.out.println("i:" + i);
			} else {
				if (hasPrivateTemplate && hasPrivateRowTemplate) {
					sumStyles.put(i, (XSSFCellStyle) cell.getCellStyle());
				} else {
					sumStyles.put(i, (XSSFCellStyle) cell.getCellStyle());
				}
			}
		}
		wbTemplate.close();
		// return cellStyles;
	}

	public static void createDynamicHeaderFromTemplate(ResultSet rsHeader, Workbook resultWorkbook, Sheet sheetData,
			int countCol, int fromRow, List<org.apache.poi.ss.usermodel.CellStyle> cellStyles) throws Exception {
		ResultSetMetaData rsMeta = rsHeader.getMetaData();
		int dynHeaderCol = rsMeta.getColumnCount();
		// Map<Integer, XSSFCellStyle> styles = createStyle(resultWorkbook);

		Map<Integer, String> mapHeaderTitle = new HashMap<>();
		Map<Integer, Integer> mapHeaderFromCol = new HashMap<>();
		Sheet sheetTemplate = resultWorkbook.getSheet("headerTemplate");
		Map<Integer, XSSFCellStyle> dynHeaderStyles = new HashMap<>();
		Map<Integer, XSSFCellStyle> sumStyles = new HashMap<>();
		Map<Integer, Integer> widthCols = new HashMap<>();
		List<Integer> styleByGroup = new ArrayList<>();
		Map<Integer, XSSFCellStyle> dynCellStyles = new HashMap<>();
		DynamicHeader.createDynamicStyleV2(resultWorkbook, sheetTemplate, dynHeaderStyles, widthCols, styleByGroup,
				sumStyles, dynCellStyles);

		int nRow = fromRow - 1, tmpColInd, indDyn;
		int cell = countCol;// countCol: vi tri cuoi cung cua cot tĩnh -> bắt đầu generate động từ cột này
		int i = 0, j = 0, indStyle = 0, indHeaderStyle = 0;
		String strTitle, strValue;
		boolean first = true;
		boolean isStyleByGroup = styleByGroup.size() > 0;
		System.out.println("isStyleByGroup: " + isStyleByGroup + "_" + dynHeaderStyles.size());
		while (rsHeader.next()) {

			j = 1;
			for (indDyn = dynHeaderCol - 1; indDyn > 0; indDyn--) {// lap cot n-1 ve co n trong rsHeader
				if (first) {
					mapHeaderTitle.put(indDyn, rsHeader.getString(indDyn));
					mapHeaderFromCol.put(indDyn, countCol);

					if (indDyn == 1) {
						first = false;
					}
					continue;
				}

				strTitle = mapHeaderTitle.get(indDyn);
				if (((strTitle == null) && (rsHeader.getString(indDyn) != null))
						|| ((strTitle != null) && !strTitle.equals(rsHeader.getString(indDyn)))) {
					tmpColInd = mapHeaderFromCol.get(indDyn);
					System.out.println("row:" + tmpColInd + "_" + nRow + "_" + cell + "_" + strTitle);
					int indTmp = indHeaderStyle;
					if (!isStyleByGroup) {
						indTmp = (cell - 1 - countCol) % dynHeaderStyles.size();
					}
					if (strTitle != null) {
						ExcelPOIUtils.addCellsAndMergedExtend(sheetData, nRow, tmpColInd, nRow - j, cell - 1, nRow - j,
								strTitle, dynHeaderStyles.get(indTmp));
					}
					mapHeaderTitle.put(indDyn, rsHeader.getString(indDyn));
					mapHeaderFromCol.put(indDyn, cell);
					if ((indDyn == 1) && isStyleByGroup) {
						indHeaderStyle++;
						indHeaderStyle = indHeaderStyle > (dynHeaderStyles.size() - 1) ? 0 : indHeaderStyle;
					}
				}

				j++;

			}
			// them 1 cell vao dong cuoi
			strValue = rsHeader.getString(dynHeaderCol);
			if (!Utils.isNullOrEmpty(strValue)) {
				System.out.println("add value:" + strValue);
				ExcelPOIUtils.addCell(sheetData, cell, nRow, strValue, dynHeaderStyles.get(indHeaderStyle),
						widthCols.get(indStyle));
			}
			// them 1 style cua cell vào biến cellStyles
			cellStyles.add(dynCellStyles.get(indStyle));
			cell++;
			indStyle++;
			indStyle = indStyle > (dynCellStyles.size() - 1) ? 0 : indStyle;
			if (!isStyleByGroup) {
				indHeaderStyle++;
				indHeaderStyle = indHeaderStyle > (dynHeaderStyles.size() - 1) ? 0 : indHeaderStyle;
			}
			i++;
			i = i > 1 ? 0 : i;

		}
		j = 1;
		for (indDyn = dynHeaderCol - 1; indDyn > 0; indDyn--) {
			tmpColInd = mapHeaderFromCol.get(indDyn);
//			if(first || tmpColInd > cell - 1) {
//
//				break;
//			}

			strTitle = mapHeaderTitle.get(indDyn);

			int indTmp = indHeaderStyle;
			if (!isStyleByGroup) {
				indTmp = (cell - 1 - countCol) % dynHeaderStyles.size();
			}
			if (strTitle != null) {
				ExcelPOIUtils.addCellsAndMergedExtend(sheetData, nRow, tmpColInd, nRow - j, cell - 1, nRow - j,
						strTitle, dynHeaderStyles.get(indTmp));
			}
			j++;

		}

		// add thêm các row cố định

		int rowDynamicDefine = sheetTemplate.getLastRowNum();
		System.out.println("rowDynamicDefine:" + rowDynamicDefine);
		// row = 0: define header style, row=last: define dynamic cell style
		nRow = fromRow - 1;
		int moreCell = 0;
		for (i = rowDynamicDefine - 1; i > 0; i--) {
			moreCell = DynamicHeader.copyRow(resultWorkbook, sheetTemplate, sheetData, i, nRow, cell);
			nRow--;
		}

		DynamicHeader.mergeSheet(sheetTemplate, sheetData, 1, fromRow - 1, nRow, cell);
		CellStyle cStyle = cellStyles.get(cellStyles.size() - 1);
		for (i = 0; i < moreCell; i++) {
			cellStyles.add(cStyle);
		}

	}

	private static boolean isDifference(ResultSet rsHeader, Map<Integer, String> mapHeaderTitle, int indDyn)
			throws Exception {
		String strTitle;
		for (int i = indDyn; i > 0; i--) {
			strTitle = mapHeaderTitle.get(i);
			if (((strTitle == null) && (rsHeader.getString(i) != null))
					|| ((strTitle != null) && !strTitle.equals(rsHeader.getString(i)))) {
				return true;
			}
		}
		return false;
	}

	public static int createDynamicHeaderFromTemplateV2(ResultSet rsHeader, Workbook resultWorkbook, Sheet sheetData,
			int countCol, int fromRow, List<org.apache.poi.ss.usermodel.CellStyle> cellStyles,
			Map<Integer, XSSFCellStyle> sumStyles, Map<Integer, XSSFCellStyle> dynCellStyles) throws Exception {

		// Map<Integer, XSSFCellStyle> styles = createStyle(resultWorkbook);

		Map<Integer, String> mapHeaderTitle = new HashMap<>();
		Map<Integer, Integer> mapHeaderFromCol = new HashMap<>();
		Sheet sheetTemplate = resultWorkbook.getSheet("headerTemplate");

		Map<Integer, XSSFCellStyle> dynHeaderStyles = new HashMap<>();

		Map<Integer, Integer> widthCols = new HashMap<>();
		List<Integer> styleByGroup = new ArrayList<>();

		DynamicHeader.createDynamicStyleV2(resultWorkbook, sheetTemplate, dynHeaderStyles, widthCols, styleByGroup,
				sumStyles, dynCellStyles);

		int nRow = fromRow - 1, tmpColInd, indDyn;
		int cell = countCol, numCell = countCol;// countCol: vi tri cuoi cung cua cot tĩnh -> bắt đầu generate động từ
												// cột này
		int i = 0, j = 0, indStyle = 0, indHeaderStyle = 0;
		String strTitle, strValue;
		boolean first = true;
		boolean isStyleByGroup = styleByGroup.size() > 0;
		System.out.println("isStyleByGroup: " + isStyleByGroup + "_" + dynHeaderStyles.size() + "_" + numCell);
		if (rsHeader != null) {
			ResultSetMetaData rsMeta = rsHeader.getMetaData();
			int dynHeaderCol = rsMeta.getColumnCount();
			while (rsHeader.next()) {

				j = 1;
				numCell++;
				for (indDyn = dynHeaderCol - 1; indDyn > 0; indDyn--) {// lap cot n-1 ve co n trong rsHeader
					if (first) {
						mapHeaderTitle.put(indDyn, rsHeader.getString(indDyn));
						mapHeaderFromCol.put(indDyn, countCol);

						if (indDyn == 1) {
							first = false;
						}
						continue;
					}

					strTitle = mapHeaderTitle.get(indDyn);
					// if((strTitle == null && rsHeader.getString(indDyn) != null) ||
					// (strTitle != null && !strTitle.equals(rsHeader.getString(indDyn)))) {
					if (DynamicHeader.isDifference(rsHeader, mapHeaderTitle, indDyn)) {
						tmpColInd = mapHeaderFromCol.get(indDyn);
						System.out.println("row:" + tmpColInd + "_" + nRow + "_" + cell + "_" + strTitle);
						int indTmp = indHeaderStyle;
						if (!isStyleByGroup) {
							indTmp = (cell - 1 - countCol) % dynHeaderStyles.size();
						}
						if (strTitle != null) {
							ExcelPOIUtils.addCellsAndMergedExtend(sheetData, nRow, tmpColInd, nRow - j, cell - 1,
									nRow - j, strTitle, dynHeaderStyles.get(indTmp));
						}
						mapHeaderTitle.put(indDyn, rsHeader.getString(indDyn));
						mapHeaderFromCol.put(indDyn, cell);
						if ((indDyn == 1) && isStyleByGroup) {
							indHeaderStyle++;
							indHeaderStyle = indHeaderStyle > (dynHeaderStyles.size() - 1) ? 0 : indHeaderStyle;
						}
					}

					j++;

				}
				// them 1 cell vao dong cuoi
				strValue = rsHeader.getString(dynHeaderCol);
				if (!Utils.isNullOrEmpty(strValue)) {
					System.out.println("add value:" + strValue);
					ExcelPOIUtils.addCell(sheetData, cell, nRow, strValue, dynHeaderStyles.get(indHeaderStyle),
							widthCols.get(indStyle));
				}
				// them 1 style cua cell vào biến cellStyles
				// cellStyles.add(dynCellStyles.get(indStyle));
				cell++;
				indStyle++;
				indStyle = indStyle > (dynCellStyles.size() - 1) ? 0 : indStyle;
				if (!isStyleByGroup) {
					indHeaderStyle++;
					indHeaderStyle = indHeaderStyle > (dynHeaderStyles.size() - 1) ? 0 : indHeaderStyle;
				}
				i++;
				i = i > 1 ? 0 : i;

			}
			j = 1;
			for (indDyn = dynHeaderCol - 1; (indDyn > 0) && !first; indDyn--) {
				tmpColInd = mapHeaderFromCol.get(indDyn);
				// if(first || tmpColInd > cell - 1) {
				//
				// break;
				// }

				strTitle = mapHeaderTitle.get(indDyn);

				int indTmp = indHeaderStyle;
				if (!isStyleByGroup) {
					indTmp = (cell - 1 - countCol) % dynHeaderStyles.size();
				}
				if (strTitle != null) {
					ExcelPOIUtils.addCellsAndMergedExtend(sheetData, nRow, tmpColInd, nRow - j, cell - 1, nRow - j,
							strTitle, dynHeaderStyles.get(indTmp));
				}
				j++;

			}

		}
		// add thêm các row cố định
		if (sheetTemplate != null) {
			int rowDynamicDefine = sheetTemplate.getLastRowNum();
			System.out.println("rowDynamicDefine:" + rowDynamicDefine + "nrow: " + fromRow);
			// row = 0: define header style, row=last: define dynamic cell style
			nRow = fromRow - 1;
			int moreCell = 0;
			for (i = rowDynamicDefine; i >= DynamicHeader.ROW_FIX_FROM; i--) {
				moreCell = DynamicHeader.copyRow(resultWorkbook, sheetTemplate, sheetData, i, nRow, cell);
				nRow--;
			}

			DynamicHeader.mergeSheet(sheetTemplate, sheetData, DynamicHeader.ROW_FIX_FROM, rowDynamicDefine + 1,
					nRow + 1, cell);
			numCell = numCell + moreCell;

		}
		System.out.println("dynamicsize:" + dynCellStyles.size());
		return numCell;
	}

	private static void mergeSheet(Sheet srcSheet, Sheet destSheet, int srcFromRow, int srcToRow, int destFromRow,
			int destFromCol) {
		// If there are are any merged regions in the source row, copy to new row
		int mergeFromRow, mergeToRow, mergeFromCol, mergeToCol;
		for (int i = 0; i < srcSheet.getNumMergedRegions(); i++) {
			CellRangeAddress cellRangeAddress = srcSheet.getMergedRegion(i);
			for (int j = srcFromRow; j < srcToRow; j++) {
				if (cellRangeAddress.getFirstRow() == j) {
					mergeFromRow = (destFromRow + cellRangeAddress.getFirstRow()) - srcFromRow;

					mergeToRow = (destFromRow + cellRangeAddress.getLastRow()) - srcFromRow;
					mergeFromCol = cellRangeAddress.getFirstColumn() + destFromCol;

					mergeToCol = destFromCol + cellRangeAddress.getLastColumn();
					System.out.println("merge range1:" + cellRangeAddress.getFirstRow() + "_" + destFromRow + "_"
							+ cellRangeAddress.getLastRow() + "_" + destFromCol);
					System.out.println(
							"merge range:" + mergeFromRow + "_" + mergeToRow + "_" + mergeFromCol + "_" + mergeToCol);
					CellRangeAddress newCellRangeAddress = new CellRangeAddress(mergeFromRow, mergeToRow, mergeFromCol,
							mergeToCol);
					destSheet.addMergedRegion(newCellRangeAddress);
				}
			}

		}
	}

	private static int copyRow(Workbook workbook, Sheet srcSheet, Sheet destSheet, int sourceRowNum,
			int destinationRowNum, int destFromCol) {
		// Get the source / new row
		Row destRow = destSheet.getRow(destinationRowNum);
		Row sourceRow = srcSheet.getRow(sourceRowNum);
		int fromCol = 0;
		int cells = 0;
		// If the row exist in destination, push down all rows by 1 else create a new
		// row
		if (destRow != null) {
			// destSheet.shiftRows(destinationRowNum, destSheet.getLastRowNum(), 1);
			fromCol = destFromCol;// destRow.getLastCellNum();
		} else {
			destRow = destSheet.createRow(destinationRowNum);
		}

		// Loop through source columns to add to new row
		cells = sourceRow.getLastCellNum();
		for (int i = 0; i < cells; i++) {
			// Grab a copy of the old/new cell
			Cell oldCell = sourceRow.getCell(i);
			Cell newCell = destRow.createCell(fromCol + i);
			int width = srcSheet.getColumnWidth(i);
			destSheet.setColumnWidth(fromCol + i, width);
			// If the old cell is null jump to next cell
			if (oldCell == null) {
				newCell = null;
				continue;
			}

			// Copy style from old cell and apply to new cell
			CellStyle newCellStyle = workbook.createCellStyle();
			newCellStyle.cloneStyleFrom(oldCell.getCellStyle());

			newCell.setCellStyle(newCellStyle);

			// If there is a cell comment, copy
			if (oldCell.getCellComment() != null) {
				newCell.setCellComment(oldCell.getCellComment());
			}

			// If there is a cell hyperlink, copy
			if (oldCell.getHyperlink() != null) {
				newCell.setHyperlink(oldCell.getHyperlink());
			}

			// Set the cell data type
			newCell.setCellType(oldCell.getCellType());

			// Set the cell data value
			switch (oldCell.getCellType()) {
			case BLANK:
				newCell.setCellValue(oldCell.getStringCellValue());
				break;
			case BOOLEAN:
				newCell.setCellValue(oldCell.getBooleanCellValue());
				break;
			case ERROR:
				newCell.setCellErrorValue(oldCell.getErrorCellValue());
				break;
			case FORMULA:
				newCell.setCellFormula(oldCell.getCellFormula());
				break;
			case NUMERIC:
				newCell.setCellValue(oldCell.getNumericCellValue());
				break;
			case STRING:
				newCell.setCellValue(oldCell.getRichStringCellValue());
				break;
			default:
				break;
			}
		}
		return cells;

	}

}
