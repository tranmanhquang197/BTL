package com.tsolution._3services.report;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;

import com.tsolution._1entities.vo.ReportParameterVO;
import com.tsolution.utils.LogUtilityCommon;

import net.sf.jxls.transformer.XLSTransformer;

public class Export2Excell {
	private static final String WILDCARD = "!@#";
	static final String GROUPING_COLUMN_NAME = "GROUPING_LEVEL";
	static final String MERGE_ROWS_COLUMN_NAME = "MERGE_ROWS";

	public static void createHeader(ResultSet rsHeader, Workbook resultWorkbook, Sheet sheetData, int countCol,
			int fromRow) throws Exception {
		String catId = "", tmpCatId;
		int colIndex = countCol, rowIndex = fromRow - 1; // tao cot dong tu hang: fromRow -1, cot: countCol
		Row row = sheetData.getRow(rowIndex);
		colIndex = row.getPhysicalNumberOfCells();
		int mergeFromRow = rowIndex - 1, mergeFromCol = colIndex, mergeEndRow = rowIndex - 1, mergeEndCol = colIndex;

		System.out.println("colIndex:" + colIndex + "roa:" + rowIndex);

		List<String> lsData = new ArrayList<>();

		List<Integer> lsMergeCountCols = new ArrayList<>();
		List<String> lsMergeCats = new ArrayList<>();

		// headerTemplate la row cuoi cua

		while (rsHeader.next()) {
			tmpCatId = rsHeader.getString(1);
			if (!catId.equals(tmpCatId) && !"".equals(catId)) {
				ExcelPOIUtils.addCellsAndMerged(sheetData, mergeFromCol, mergeFromRow, mergeEndCol - 1, mergeEndRow,
						catId, null);

				lsMergeCountCols.add(mergeEndCol - mergeFromCol);
				lsMergeCats.add(catId);
				mergeFromCol = mergeEndCol;
			}
			catId = rsHeader.getString(1);

			ExcelPOIUtils.addCell(sheetData, colIndex, rowIndex, rsHeader.getObject(2), null); // index = 2: product
			colIndex++;
			mergeEndCol++;
			lsData.add(rsHeader.getString(2));

		}
		if (mergeFromCol < mergeEndCol) {
			ExcelPOIUtils.addCellsAndMerged(sheetData, mergeFromCol, mergeFromRow, mergeEndCol - 1, mergeEndRow, catId,
					null);
			lsMergeCats.add(catId);
			lsMergeCountCols.add(mergeEndCol - mergeFromCol);
		}

		ExcelPOIUtils.addCellsAndMerged(sheetData, countCol, mergeFromRow - 1, colIndex - 1, mergeEndRow - 1,
				"chi tieu", null);
		mergeFromCol = colIndex;
		int mergeLvl2From = colIndex;
		for (int i = 0; i < 2; i++) {
			for (int j = 0; j < lsData.size(); j++) {
				ExcelPOIUtils.addCell(sheetData, colIndex, rowIndex, lsData.get(j), null); // index = 2: product
				colIndex++;

			}

			for (int k = 0; k < lsMergeCountCols.size(); k++) {
				mergeEndCol = mergeFromCol + lsMergeCountCols.get(k);
				ExcelPOIUtils.addCellsAndMerged(sheetData, mergeFromCol, mergeFromRow, mergeEndCol - 1, mergeEndRow,
						lsMergeCats.get(k), null);
				mergeFromCol = mergeEndCol;
			}
			ExcelPOIUtils.addCellsAndMerged(sheetData, mergeLvl2From, mergeFromRow - 1, colIndex - 1, mergeEndRow - 1,
					"thuc dat", null);
			mergeLvl2From = colIndex;
		}
		ExcelPOIUtils.addCellsAndMerged(sheetData, countCol, mergeFromRow - 2, colIndex - 1, mergeEndRow - 2,
				"GIÁ TRỊ CỐT LÕI", null);
	}

	public static List<org.apache.poi.ss.usermodel.CellStyle> getCellStyles(Sheet sheetData, ReportParameterVO rp)
			throws Exception {
		int rowIndex = 0, numCols = 0;
		ArrayList<org.apache.poi.ss.usermodel.CellStyle> cellStyles = new ArrayList<>();
		try {
			rowIndex = sheetData.getLastRowNum();

			Row row = sheetData.getRow(rowIndex);
			numCols = row.getLastCellNum();
			Cell cell;

			for (int i = 0; i < numCols; i++) {
				cell = row.getCell(i);
				if (cell == null) {
					System.out.println("i:" + i);
				} else {
					cellStyles.add(cell.getCellStyle());
				}
			}
			rp.setRowHeight(row.getHeight());
			rp.setFromRow(rowIndex);
			rp.setNumCols(numCols);

			sheetData.removeRow(row);
			return cellStyles;
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		}

	}

	public static int exportExcel(ResultSet rsData, ResultSet rsDynamicCols, ReportParameterVO rptParam)
			throws Exception {

		String templatePath = rptParam.getRealTemplFile();
		String outputPath = rptParam.getRealOutFile();
		int countCol = 0, groupingCol = 0;
		int fromRow = 0;
		int count = 0;
		boolean hasGrouping = false;
		// String sheetName = param.get("sheetName");
		try {
			ResultSetMetaData metaData = rsData.getMetaData();

			groupingCol = metaData.getColumnCount();
			if (Export2Excell.GROUPING_COLUMN_NAME.equals(metaData.getColumnName(groupingCol))) {
				System.out.println("has grouping column" + groupingCol);

				hasGrouping = true;
			}
			CellStyle styleHeader = null;
			List<org.apache.poi.ss.usermodel.CellStyle> cellStyles = Export2Excell.copyTemplate(rsDynamicCols,
					templatePath, outputPath, rptParam, styleHeader);

			countCol = cellStyles.size();
			fromRow = rptParam.getFromRow();
			System.out.println("row:" + fromRow + "col:" + countCol);
			File myFile = new File(outputPath);

			FileInputStream fis = new FileInputStream(myFile);

			// Finds the workbook instance for XLSX file
			XSSFWorkbook wb = new XSSFWorkbook(fis);

			// Return first sheet from the XLSX workbook
			// XSSFSheet mySheet = workbook.getSheetAt(0);

			// XSSFWorkbook wb = new XSSFWorkbook(new File(outputPath));
			SXSSFWorkbook workbook = new SXSSFWorkbook(wb, 100);

			// SXSSFWorkbook workbook = new SXSSFWorkbook(-1);
			Map<String, XSSFCellStyle> style = null;// ExcelPOIUtils.createStyles(workbook);

			// workbook.setCompressTempFiles(true);
			// Tao sheet
			SXSSFSheet sheetData = workbook.getSheetAt(0);
			// createHeader(rsData, workbook, sheetData, countCol, fromRow, groupingCol,
			// rptParam.getStyleHeader());

			count = Export2Excell.data2Excel(rsData, workbook, sheetData, countCol, fromRow, groupingCol, style,
					cellStyles, hasGrouping, rptParam.getMaxGroupLevel());

			String outStr = outputPath;
			System.out.println("out1:" + outStr);
			FileOutputStream out = new FileOutputStream(outStr);
			workbook.write(out);
			workbook.close();
			out.flush();
			out.close();
		} catch (Exception ex) {
			count = 0;
			ex.printStackTrace();
			throw ex;
		}
		return count;
	}

	public static int exportExcelDynamicAndParamHeader(ResultSet rsData, ResultSet rsHeader, ReportParameterVO rptParam,
			String param) throws Exception {
		if ((param != null) && !"".equals(param)) {
			String[] params = param.split(";");
			Map beans = rptParam.getBeans();
			for (String par : params) {
				String[] keyvalue = par.split("=");
				if ((keyvalue != null) && (keyvalue.length == 2)) {
					beans.put(keyvalue[0], keyvalue[1]);
				}
			}
		}

		return Export2Excell.exportExcelDynamicHeaderV2(rsData, rsHeader, rptParam);
	}

	public static int exportExcelDynamicHeaderV2(ResultSet rsData, ResultSet rsHeader, ReportParameterVO rp)
			throws Exception {

		String templatePath = rp.getRealTemplFile();
		String outputPath = rp.getRealOutFile();
		int countCol = 0;
		int fromRow = 0;
		int count = 0;
		FileInputStream fis = null;
		SXSSFWorkbook workbook = null;
		FileOutputStream out = null;
		XSSFWorkbook wb = null;
		try {

			Map<Integer, XSSFCellStyle> sumStyles = new HashMap<>();
			Map<Integer, XSSFCellStyle> dynCellStyles = new HashMap<>();
			List<org.apache.poi.ss.usermodel.CellStyle> cellStyles = Export2Excell.copyTemplateV2(rsHeader,
					templatePath, outputPath, rp, sumStyles, dynCellStyles);

			countCol = rp.getNumCols();
			fromRow = rp.getFromRow();
			System.out.println("dyn row:" + fromRow + "col:" + countCol + "dynsize: " + dynCellStyles.size());
			File myFile = new File(outputPath);

			fis = new FileInputStream(myFile);

			// Finds the workbook instance for XLSX file
			wb = new XSSFWorkbook(fis);

			workbook = new SXSSFWorkbook(wb, 10000);

			Map<String, XSSFCellStyle> style = null;

			SXSSFSheet sheet = workbook.getSheetAt(0);
			count = Export2Excell.data2ExcelV2_1(rsData, workbook, sheet, countCol, fromRow, style, cellStyles,
					rp.getMaxGroupLevel(), sumStyles, dynCellStyles, rp);

			String outStr = outputPath;
			out = new FileOutputStream(outStr);
			workbook.write(out);
			workbook.close();
			out.flush();
			out.close();
		} catch (Exception ex) {

			ex.printStackTrace();
			throw ex;
		} finally {
			if (fis != null) {
				try {
					fis.close();
				} catch (Exception e) {
					LogUtilityCommon.logError(e, e.getMessage());
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (Exception e) {
					LogUtilityCommon.logError(e, e.getMessage());
				}
			}
			if (workbook != null) {
				try {
					workbook.close();
				} catch (Exception e) {
					LogUtilityCommon.logError(e, e.getMessage());
				}
			}
			if (wb != null) {
				try {
					wb.close();
				} catch (Exception e) {
					LogUtilityCommon.logError(e, e.getMessage());
				}
			}
		}
		return count;
	}

	public static int exportExcelV2(ResultSet rsData, ResultSet rsDynamicCols, ReportParameterVO rptParam)
			throws Exception {

		String templatePath = rptParam.getRealTemplFile();
		String outputPath = rptParam.getRealOutFile();
		int countCol = 0;
		int fromRow = 0;
		int count = 0;
		FileInputStream fis = null;
		SXSSFWorkbook workbook = null;
		FileOutputStream out = null;
		XSSFWorkbook wb = null;
		try {
			CellStyle styleHeader = null;

			List<org.apache.poi.ss.usermodel.CellStyle> cellStyles = Export2Excell.copyTemplate(rsDynamicCols,
					templatePath, outputPath, rptParam, styleHeader);

			countCol = cellStyles.size();
			fromRow = rptParam.getFromRow();
			System.out.println("row:" + fromRow + "col:" + countCol);
			File myFile = new File(outputPath);

			fis = new FileInputStream(myFile);

			wb = new XSSFWorkbook(fis);

			workbook = new SXSSFWorkbook(wb, 10000);

			Map<String, XSSFCellStyle> style = null;

			// Tao sheet
			SXSSFSheet sheetData = workbook.getSheetAt(0);

			count = Export2Excell.data2ExcelV2(rsData, workbook, sheetData, countCol, fromRow, style, cellStyles,
					rptParam.getMaxGroupLevel());

			String outStr = outputPath;

			out = new FileOutputStream(outStr);
			workbook.write(out);
			workbook.close();
			out.flush();
			out.close();
		} catch (Exception ex) {
			count = 0;
			ex.printStackTrace();
			throw ex;
		} finally {
			if (fis != null) {
				try {
					fis.close();
				} catch (Exception e) {
					LogUtilityCommon.logError(e, e.getMessage());
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (Exception e) {
					LogUtilityCommon.logError(e, e.getMessage());
				}
			}
			if (workbook != null) {
				try {
					workbook.close();
				} catch (Exception e) {
					LogUtilityCommon.logError(e, e.getMessage());
				}
			}
			if (wb != null) {
				try {
					wb.close();
				} catch (Exception e) {
					e.printStackTrace();
					// LogUtilityCommon.logError(e, e.getMessage());
				}
			}
		}

		return count;
	}

	public static List<org.apache.poi.ss.usermodel.CellStyle> copyTemplate(ResultSet rsHeader, String templatePath,
			String outputPath, ReportParameterVO rp, CellStyle styleHeader) throws Exception {
		InputStream inputStream = null;
		OutputStream os = null;
		try {

			System.out.println("file:" + templatePath);

			inputStream = new ClassPathResource(templatePath).getInputStream(); // new BufferedInputStream(new
																				// FileInputStream(templatePath));
			XLSTransformer transformer = new XLSTransformer();
			Workbook resultWorkbook = transformer.transformXLS(inputStream, rp.getBeans());
			Sheet sheet = resultWorkbook.getSheetAt(0);

			List<org.apache.poi.ss.usermodel.CellStyle> cellStyles = Export2Excell.getCellStyles(sheet, rp);

			// create dynamic column
			if (rsHeader != null) {
				// DynamicHeader.createHeader361(rsHeader, resultWorkbook, sheet,
				// cellStyles.size(), rp.fromRow, cellStyles);
				DynamicHeader.createDynamicHeaderFromTemplate(rsHeader, resultWorkbook, sheet, cellStyles.size(),
						rp.getFromRow(), cellStyles);

			}

			os = new BufferedOutputStream(new FileOutputStream(outputPath));
			resultWorkbook.write(os);
			os.flush();
			System.out.println("file out:" + outputPath);
			os.close();

			return cellStyles;
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		} finally {
			if (inputStream != null) {
				IOUtils.closeQuietly(inputStream);
			}
			if (os != null) {
				IOUtils.closeQuietly(os);
			}
		}
	}

	public static List<org.apache.poi.ss.usermodel.CellStyle> copyTemplateV2(ResultSet rsHeader, String templatePath,
			String outputPath, ReportParameterVO rp, Map<Integer, XSSFCellStyle> sumStyles,
			Map<Integer, XSSFCellStyle> dyncellStyles) throws Exception {
		InputStream inputStream = null;
		OutputStream os = null;
		try {

			System.out.println("file:" + templatePath);

			inputStream = new ClassPathResource(templatePath).getInputStream(); // new BufferedInputStream(new
																				// FileInputStream(templatePath));
			XLSTransformer transformer = new XLSTransformer();
			Workbook resultWorkbook = transformer.transformXLS(inputStream, rp.getBeans());
			Sheet sheet = resultWorkbook.getSheetAt(0);

			List<org.apache.poi.ss.usermodel.CellStyle> cellStyles = Export2Excell.getCellStyles(sheet, rp);
			int dynCells = 0;
			// create dynamic column
			// if(rsHeader != null ) {
			// DynamicHeader.createHeader361(rsHeader, resultWorkbook, sheet,
			// cellStyles.size(), rp.fromRow, cellStyles);
			dynCells = DynamicHeader.createDynamicHeaderFromTemplateV2(rsHeader, resultWorkbook, sheet,
					cellStyles.size(), rp.getFromRow(), cellStyles, sumStyles, dyncellStyles);

			// }
			rp.setNumCols(dynCells);
			os = new BufferedOutputStream(new FileOutputStream(outputPath));
			resultWorkbook.write(os);
			os.flush();
			System.out.println("file out:" + outputPath + "dynSize:" + dyncellStyles.size());
			os.close();

			return cellStyles;
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		} finally {
			if (inputStream != null) {
				IOUtils.closeQuietly(inputStream);
			}
			if (os != null) {
				IOUtils.closeQuietly(os);
			}
		}
	}

	public static XSSFCellStyle createSumStyle(SXSSFWorkbook workbook, XSSFCellStyle style) {
		XSSFCellStyle styleSum = (XSSFCellStyle) workbook.createCellStyle();

		styleSum.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		styleSum.setAlignment(style.getAlignmentEnum());
		styleSum.setDataFormat(style.getDataFormat());
		styleSum.setVerticalAlignment(VerticalAlignment.CENTER);
		// style.setFillForegroundColor(new XSSFColor(new java.awt.Color(197, 217,
		// 241)));
		// style.setFillBackgroundColor(new XSSFColor(new java.awt.Color(197, 217,
		// 241)));

		styleSum.setFillForegroundColor(new XSSFColor(new java.awt.Color(197, 217, 241)));
		styleSum.setBorderLeft(style.getBorderLeftEnum());
		styleSum.setBorderRight(style.getBorderRightEnum());
		styleSum.setBorderTop(style.getBorderTopEnum());
		styleSum.setBorderBottom(style.getBorderBottomEnum());

		styleSum.getFont().setBold(true);
		return styleSum;
	}

	public static int data2ExcelV2_1(ResultSet rs, SXSSFWorkbook workbook, SXSSFSheet sheetData, int countCol,
			int fromRow, Map<String, XSSFCellStyle> styles, List<org.apache.poi.ss.usermodel.CellStyle> cellStyles,
			int maxGroupLevel, Map<Integer, XSSFCellStyle> dynSumStyles, Map<Integer, XSSFCellStyle> dynCellStyles,
			ReportParameterVO rptParam) throws Exception {

		XSSFCellStyle style = null;
		boolean isStyleSum = false;
		int rowInd = fromRow;

//		if(1==1) {
//			return 1;
//		}
		int groupingLevel = 0;
		Map<Integer, Integer> groupRows = new HashMap<>();
		groupRows.put(0, rowInd);
		// maxGroupLevel bien dung de set group trong excell
		maxGroupLevel++;

		ResultSetMetaData metaData = rs.getMetaData();
		Map map = Export2Excell.getMetaData(metaData);

		// check xem du lieu co cot dong tong cong khong de set style khi gap dong tong
		// cong
		Integer groupingCol = (Integer) map.get(Export2Excell.GROUPING_COLUMN_NAME);

		Integer mergeColInd = (Integer) map.get(Export2Excell.MERGE_ROWS_COLUMN_NAME);
		Integer mergeRows = null;

		HashMap<String, XSSFCellStyle> sumStyles = new HashMap<>();
		while (rs.next()) {
			// tinh tong

			isStyleSum = false;
			mergeRows = 1;

			// check xem có phải dòng tổng cộng không. dòng tổng cộng là dòng có dữ liệu > 0
			if (groupingCol != null) {
				groupingLevel = rs.getInt(groupingCol);
				if (groupingLevel > 0) {
					isStyleSum = true;

				} else {
					groupingLevel = maxGroupLevel;
				}
			}
			// lấy số row cần phải merge
			if (mergeColInd != null) {
				mergeRows = rs.getInt(mergeColInd);
			}

			for (int colInd = 0; colInd < countCol; colInd++) {
				// style = (XSSFCellStyle) cellStyles.get(colInd);

				style = Export2Excell.getCellStyle(colInd, cellStyles, dynCellStyles, rs.getObject(colInd + 1),
						rs.getMetaData().getColumnType(colInd + 1), rs.getMetaData().getColumnName(colInd + 1));
				if (style == null) {
					System.out.println("style is null");
				}
				if (isStyleSum) {
					style = Export2Excell.createCellSumStyle(workbook, colInd, groupingLevel, style,
							dynSumStyles.get(groupingLevel), sumStyles);

					// style.setDataFormat(tmpStyle.getDataFormat());

				}
				try {
					ExcelPOIUtils.addMultiCells(sheetData, colInd, rowInd, rs.getObject(colInd + 1), style,
							Export2Excell.WILDCARD, mergeRows, rptParam);
				} catch (Exception ex) {
					System.out.println("conInd:" + colInd);
					throw ex;
				}

			}
			if (!isStyleSum || (isStyleSum && (groupingLevel < maxGroupLevel))) {

				for (int j = 0; j < mergeRows; j++) {
					sheetData.setRowOutlineLevel(rowInd + j, groupingLevel);
				}
			}

			rowInd = rowInd + mergeRows;
		}
		return rowInd - fromRow;
	}

	private static XSSFCellStyle getCellStyle(int cell, List<org.apache.poi.ss.usermodel.CellStyle> cellStyles,
			Map<Integer, XSSFCellStyle> dynCellStyles, Object value, int colType, String colName) {

		if (cell < cellStyles.size()) {
			return (XSSFCellStyle) cellStyles.get(cell);
		}

		if ((colName != null) && colName.toUpperCase().startsWith("NUM_")) {
			cellStyles.add(dynCellStyles.get(1));
			CellStyle c = dynCellStyles.get(1);

			return (XSSFCellStyle) c; // number
		}

		if ((colName != null) && colName.toUpperCase().startsWith("PER_")) {
			cellStyles.add(dynCellStyles.get(2));
			CellStyle c = dynCellStyles.get(2);

			return (XSSFCellStyle) c; // PERCENT
		}

		if ((colName != null) && colName.toUpperCase().startsWith("STR_")) {
			cellStyles.add(dynCellStyles.get(0));
			CellStyle c = dynCellStyles.get(0);

			return (XSSFCellStyle) c; // STRING
		}
		switch (colType) {
		case Types.BIGINT:
		case Types.DECIMAL:
		case Types.DOUBLE:
		case Types.FLOAT:
		case Types.INTEGER:
		case Types.NUMERIC:
		case Types.SMALLINT:
			cellStyles.add(dynCellStyles.get(1));
			CellStyle c = dynCellStyles.get(1);

			return (XSSFCellStyle) c; // number
		case Types.CHAR:
		case Types.DATE:
		case Types.NVARCHAR:
		case Types.LONGVARCHAR:
			if ((value != null) && ((String) value).endsWith("%")) {

				cellStyles.add(dynCellStyles.get(2));
				return dynCellStyles.get(2);// percent
			}
			cellStyles.add(dynCellStyles.get(0));
			return dynCellStyles.get(0);// String
		case Types.DATALINK:
			cellStyles.add(dynCellStyles.get(3));
			return dynCellStyles.get(3);// percent
		}

		cellStyles.add(dynCellStyles.get(0));
		return dynCellStyles.get(0);// String
	}

	private static XSSFCellStyle createCellSumStyle(Workbook wb, int cell, int level, CellStyle cellStyle,
			CellStyle cellSumStyle, Map<String, XSSFCellStyle> sumStyles) {

		String ind = cell + "-" + level;
		CellStyle sum = sumStyles.get(ind);
		if (sum != null) {
			return (XSSFCellStyle) sum;
		}
		if (cellSumStyle == null) {
			System.out.println("cellSumStyle is null");

		}

		sum = wb.createCellStyle();
		sum.cloneStyleFrom(cellSumStyle);
		sum.setDataFormat(cellStyle.getDataFormat());
		sum.setAlignment(cellStyle.getAlignmentEnum());
		sumStyles.put(ind, (XSSFCellStyle) sum);

		return (XSSFCellStyle) sum;
	}

	public static int data2ExcelV2(ResultSet rs, SXSSFWorkbook workbook, SXSSFSheet sheetData, int countCol,
			int fromRow, Map<String, XSSFCellStyle> styles, List<org.apache.poi.ss.usermodel.CellStyle> cellStyles,
			int maxGroupLevel) throws Exception {

		System.out.println("col:" + countCol + " row:" + fromRow);
		XSSFCellStyle style = null;
		boolean isStyleSum = false;
		int rowInd = fromRow;

		int groupingLevel = 0;
		Map<Integer, Integer> groupRows = new HashMap<>();
		groupRows.put(0, rowInd);
		// maxGroupLevel bien dung de set group trong excell
		maxGroupLevel++;

		ResultSetMetaData metaData = rs.getMetaData();
		Map map = Export2Excell.getMetaData(metaData);

		// check xem du lieu co cot dong tong cong khong de set style khi gap dong tong
		// cong
		Integer groupingCol = (Integer) map.get(Export2Excell.GROUPING_COLUMN_NAME);

		Integer mergeColInd = (Integer) map.get(Export2Excell.MERGE_ROWS_COLUMN_NAME);
		Integer mergeRows = null;
		while (rs.next()) {
			// tinh tong

			isStyleSum = false;
			mergeRows = 1;

			// check xem có phải dòng tổng cộng không. dòng tổng cộng là dòng có dữ liệu > 0
			if (groupingCol != null) {
				groupingLevel = rs.getInt(groupingCol);
				if (groupingLevel > 0) {
					isStyleSum = true;

				} else {
					groupingLevel = maxGroupLevel;
				}
			}
			// lấy số row cần phải merge
			if (mergeColInd != null) {
				mergeRows = rs.getInt(mergeColInd);
			}

			for (int colInd = 0; colInd < countCol; colInd++) {
				style = (XSSFCellStyle) cellStyles.get(colInd);

				if (isStyleSum) {
					style = Export2Excell.createSumStyle(workbook, style);
				}
				try {
					ExcelPOIUtils.addMultiCells(sheetData, colInd, rowInd, rs.getObject(colInd + 1), style,
							Export2Excell.WILDCARD, mergeRows);
				} catch (Exception ex) {
					System.out.println("conInd:" + colInd);
					throw ex;
				}

			}
			if (!isStyleSum || (isStyleSum && (groupingLevel < maxGroupLevel))) {

				for (int j = 0; j < mergeRows; j++) {
					sheetData.setRowOutlineLevel(rowInd + j, groupingLevel);
				}
			}

			rowInd = rowInd + mergeRows;
		}
		return rowInd - fromRow;
	}

	public static int data2Excel(ResultSet rs, SXSSFWorkbook workbook, SXSSFSheet sheetData, int countCol, int fromRow,
			int groupingCol, Map<String, XSSFCellStyle> styles, List<org.apache.poi.ss.usermodel.CellStyle> cellStyles,
			boolean hasGrouping, int maxGroupLevel) throws Exception {

		System.out.println("col:" + countCol + " row:" + fromRow);
		XSSFCellStyle style = null;
		boolean isStyleSum = false;
		int count = fromRow;
		int groupingLevel = 0;
		Map<Integer, Integer> groupRows = new HashMap<>();
		groupRows.put(0, count);

		maxGroupLevel++;
		while (rs.next()) {
			// tinh tong

			isStyleSum = false;

			if (hasGrouping) {
				groupingLevel = rs.getInt(groupingCol);
				if (groupingLevel > 0) {
					isStyleSum = true;

				} else {
					groupingLevel = maxGroupLevel;
				}
			}
			for (int i = 0; i < countCol; i++) {
				style = (XSSFCellStyle) cellStyles.get(i);
				// style = styles.get(ExcelPOIUtils.STYLE_TEXT_GROUP_LEVEL_1);
				if (isStyleSum) {
					style = Export2Excell.createSumStyle(workbook, style);
				}

				ExcelPOIUtils.addCell(sheetData, i, count, rs.getObject(i + 1), style);

			}
			if (!isStyleSum || (isStyleSum && (groupingLevel < maxGroupLevel))) {
				sheetData.setRowOutlineLevel(count, groupingLevel);
			}

			count++;
		}
		return count - fromRow;
	}

	private static Map getMetaData(ResultSetMetaData metaData) throws Exception {
		int cols = metaData.getColumnCount();
		Map<String, Integer> map = new HashMap<>();
		for (int i = 1; i <= cols; i++) {
			System.out.println("ind:" + i);
			map.put(metaData.getColumnName(i), i);
		}
		return map;
	}

	public static boolean hasGroupingColumn(ResultSet rs, String columnName) throws SQLException {
		ResultSetMetaData rsmd = rs.getMetaData();
		int columns = rsmd.getColumnCount();

		if (columnName.equals(rsmd.getColumnName(columns))) {
			return true;
		}

		return false;
	}

}
