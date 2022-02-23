package com.tsolution.utils;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.OptionalInt;
import java.util.stream.IntStream;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.formula.BaseFormulaEvaluator;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.Comment;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.util.Units;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jxls.area.Area;
import org.jxls.builder.AreaBuilder;
import org.jxls.builder.xls.XlsCommentAreaBuilder;
import org.jxls.common.CellRef;
import org.jxls.common.Context;
import org.jxls.formula.FastFormulaProcessor;
import org.jxls.transform.Transformer;
import org.jxls.transform.poi.PoiContext;
import org.jxls.transform.poi.PoiTransformer;
import org.springframework.core.io.ClassPathResource;

import com.tsolution.utils.jxls.commands.AutoRowHeightCommand;
import com.tsolution.utils.jxls.commands.GroupRowCommand;

public class Jxls2xTransformerUtils {
	private Jxls2xTransformerUtils() {
	}

	private static Logger log = LogManager.getLogger(Jxls2xTransformerUtils.class);

	public static void resolveMergeCells(XSSFWorkbook workbook, XSSFSheet sheetMergeConfig) {
		Map<Integer, List<Integer>> mapLevelMergeCols = Jxls2xTransformerUtils.getMapLevelMergeCol(sheetMergeConfig);
		// Lấy ra Dòng đầu tiên vs cuối cùng của sheet dữ liệu
		XSSFSheet sheet = workbook.getSheetAt(0);
		int beginRow = (int) sheetMergeConfig.getRow(0).getCell(0).getNumericCellValue();
		int endRow = sheet.getLastRowNum();
		Map<Integer, Integer> mapLevelBeginRow = Jxls2xTransformerUtils.generateMapLevelBeginRow(mapLevelMergeCols,
				beginRow);
		for (int rowIndex = beginRow; rowIndex <= (endRow + 1); rowIndex++) {
			for (Map.Entry<Integer, Integer> entry : mapLevelBeginRow.entrySet()) {
				Integer lastRowOfLevel = entry.getValue();
				List<Integer> colIndexs = mapLevelMergeCols.get(entry.getKey());
				String lastValue = Jxls2xTransformerUtils.getRawValueCell(sheet, lastRowOfLevel, colIndexs.get(0));
				String cellValue = Jxls2xTransformerUtils.getRawValueCell(sheet, rowIndex,
						mapLevelMergeCols.get(entry.getKey()).get(0));
				if (lastValue.equalsIgnoreCase(cellValue)) {
					continue;
				}
				for (Integer colIndex : colIndexs) {
					sheet.addMergedRegion(new CellRangeAddress(lastRowOfLevel, rowIndex - 1, colIndex, colIndex));
				}
				mapLevelBeginRow.put(entry.getKey(), rowIndex);
			}
		}
	}

	private static Map<Integer, List<Integer>> getMapLevelMergeCol(XSSFSheet sheetMergeConfig) {
		int endRowMergeConfig = sheetMergeConfig.getLastRowNum();
		// Lấy ra cấu hình config tối đa 5 level merge (tính theo cột A-B-C-D-E)
		// Dòng đầu tiên xác định là dòng chứa unique value để compare // Các dòng sau
		// là các cột ăn theo
		Map<Integer, List<Integer>> mapLevelMergeCols = new HashMap<>();
		for (int level = 0; level < 5; level++) {
			List<Integer> mergeCols = new ArrayList<>();
			for (int rowIndex = 1; rowIndex <= endRowMergeConfig; rowIndex++) {
				Row row = sheetMergeConfig.getRow(rowIndex);
				if ((row.getCell(level) != null) && CellType.NUMERIC.equals(row.getCell(level).getCellType())) {
					mergeCols.add((int) row.getCell(level).getNumericCellValue());
				}
			}
			mapLevelMergeCols.put(level, mergeCols);
		}
		return mapLevelMergeCols;
	}

	private static Map<Integer, Integer> generateMapLevelBeginRow(Map<Integer, List<Integer>> mapLevelMergeCols,
			int beginRow) {
		// Xác định vị trí bắt đầu merge cho các level có config
		Map<Integer, Integer> mapLevelBeginRow = new HashMap<>();
		for (Map.Entry<Integer, List<Integer>> entry : mapLevelMergeCols.entrySet()) {
			if (!entry.getValue().isEmpty()) {
				mapLevelBeginRow.put(entry.getKey(), beginRow);
			}
		}
		return mapLevelBeginRow;
	}

	private static String getRawValueCell(XSSFSheet sheet, int rowIndex, int colIndex) {
		String cellValue = null;
		XSSFRow row = sheet.getRow(rowIndex);
		if (row != null) {
			XSSFCell cell = row.getCell(colIndex);
			if (cell != null) {
				cellValue = cell.getRawValue();
			}
		}
		if (cellValue == null) {
			cellValue = "NULL";
		}
		return cellValue;
	}

	public static String poiTransformer(String relativeTemplatePath, Map<String, Object> mapBeanParams, String outPath,
			String fileName) {
		return Jxls2xTransformerUtils.transformer(relativeTemplatePath, mapBeanParams, outPath, fileName, null, null);
	}

	public static String poiTransformer(String relativeTemplatePath, Map<String, Object> mapBeanParams, String outPath,
			String fileName, String templateSheetName, String resultSheetName) {
		return Jxls2xTransformerUtils.transformer(relativeTemplatePath, mapBeanParams, outPath, fileName,
				templateSheetName, resultSheetName);
	}

	private static String transformer(String relativeTemplatePath, Map<String, Object> mapBeanParams, String outPath,
			String fileName, String templateSheetName, String resultSheetName) {
		Jxls2xTransformerUtils.log.info("Start export Excel!");
		long startTime = System.nanoTime();

		if (fileName == null) {
			fileName = new SimpleDateFormat("yyyyMMdd-HHmmssSSS").format(new Date()) + "_"
					+ relativeTemplatePath.substring(relativeTemplatePath.lastIndexOf('/') + 1);
		}
		String absoluteOutPath = Paths.get(Paths.get(outPath).toString(), fileName).toString();
		int resultSheetIndex = 1;
		try (InputStream inputStream = new ClassPathResource(relativeTemplatePath).getInputStream();
				OutputStream outputStream = new FileOutputStream(absoluteOutPath)) {
			if (inputStream.available() < 0) {
				return null;
			}
			Workbook workbook = WorkbookFactory.create(inputStream);
			Transformer transformer = PoiTransformer.createSxssfTransformer(workbook, 100, false);
			transformer.setEvaluateFormulas(true);
			AreaBuilder areaBuilder = new XlsCommentAreaBuilder(transformer);
			XlsCommentAreaBuilder.addCommandMapping("groupRow", GroupRowCommand.class);
			// jx:groupRow(collapseIf="detail.orderDetailDtos.size()>1" lastCell="D10")
			XlsCommentAreaBuilder.addCommandMapping("autoRowHeight", AutoRowHeightCommand.class);
			// jx:autoRowHeight(lastCell="A2")
			long startTime1 = System.nanoTime();
			List<Area> xlsAreaList = areaBuilder.build();
			OptionalInt xlsAreaIndex = IntStream.rangeClosed(1 - xlsAreaList.size(), 0).map(i -> -i).filter(
					ix -> xlsAreaList.get(ix).getStartCellRef().getSheetName().equalsIgnoreCase(templateSheetName))
					.findFirst();
			Area xlsArea = xlsAreaList.get(xlsAreaIndex.orElse(0));
			long endTime1 = System.nanoTime();
			Jxls2xTransformerUtils.log.info("1: {}", ((endTime1 - startTime1) / 1e9));
			Context context = new PoiContext(mapBeanParams);
			context.getConfig().setIsFormulaProcessingRequired(true);

			xlsArea.setFormulaProcessor(new FastFormulaProcessor());
			xlsArea.applyAt(new CellRef((resultSheetName == null ? "Result" : resultSheetName) + "!A1"), context);
			xlsArea.processFormulas();

			workbook.setForceFormulaRecalculation(true);
			long startTime2 = System.nanoTime();
			// Ẩn hiện sheet theo nhu cầu
			OptionalInt activeSheetIndex = IntStream.rangeClosed(1 - workbook.getNumberOfSheets(), 0).map(i -> -i)
					.filter(ix -> workbook.getSheetAt(ix).getSheetName().equalsIgnoreCase(resultSheetName)).findFirst();
			resultSheetIndex = activeSheetIndex.orElse(1);
			workbook.setActiveSheet(resultSheetIndex);
			workbook.setSelectedTab(resultSheetIndex);
			OptionalInt hideSheetIndex = IntStream.rangeClosed(1 - workbook.getNumberOfSheets(), 0).map(i -> -i)
					.filter(ix -> workbook.getSheetAt(ix).getSheetName().equalsIgnoreCase(templateSheetName))
					.findFirst();
			workbook.setSheetHidden(hideSheetIndex.orElse(0), true);
			// Tính toán lại các Formula ngay và luôn
			Workbook poiWorkbook = ((PoiTransformer) transformer).getWorkbook();
			BaseFormulaEvaluator.evaluateAllFormulaCells(poiWorkbook);
			// Ghi ra outputstream
			poiWorkbook.write(outputStream);
			long endTime2 = System.nanoTime();
			Jxls2xTransformerUtils.log.info("2: {}", ((endTime2 - startTime2) / 1e9));
		} catch (IOException | IllegalArgumentException | IllegalStateException e) {
			Jxls2xTransformerUtils.log.error(e.getMessage(), e);
			return null;
		}
		Jxls2xTransformerUtils.drawSpecifyBase64Cells(absoluteOutPath, mapBeanParams, resultSheetIndex);
		if (mapBeanParams.containsKey("specialImagePosition")) {
			Jxls2xTransformerUtils.drawSpecialImagePosition(absoluteOutPath, resultSheetIndex,
					(List<DrawBase64Dto>) mapBeanParams.get("specialImagePosition"));
		}
		long endTime = System.nanoTime();
		Jxls2xTransformerUtils.log.info("Total time to export Excel: {}", ((endTime - startTime) / 1e9));
		return absoluteOutPath;
	}

	private static void drawSpecialImagePosition(String absoluteOutPath, int resultSheetIndex,
			List<DrawBase64Dto> drawBase64Dtos) {
		XSSFWorkbook workbook = null;
		try (FileInputStream fis = new FileInputStream(absoluteOutPath)) {
			workbook = new XSSFWorkbook(fis);
			XSSFSheet sheet = workbook.getSheetAt(resultSheetIndex);
			for (DrawBase64Dto drawBase64Dto : drawBase64Dtos) {
				XSSFRow row = sheet.getRow(drawBase64Dto.getBeginRowIndex());
				XSSFCell cell = row.getCell(drawBase64Dto.getBeginColIndex());
				if (StringUtils.isEmpty(drawBase64Dto.getBase64())) {
					drawBase64Dto.setBase64(cell.getStringCellValue());
				}
				Jxls2xTransformerUtils.drawQrCodeFromBase64(workbook, sheet, drawBase64Dto);
				cell.setBlank();
			}
		} catch (Exception e) {
			Jxls2xTransformerUtils.log.error(e.getMessage(), e);
		}
		if (workbook != null) {
			try (FileOutputStream fos = new FileOutputStream(absoluteOutPath)) {
				workbook.write(fos);
				workbook.close();
			} catch (IOException e) {
				Jxls2xTransformerUtils.log.error(e.getMessage(), e);
			}
		}
	}

	private static void drawSpecifyBase64Cells(String absoluteOutPath, Map<String, Object> mapBeanParams,
			int resultSheetIndex) {
		XSSFWorkbook workbook = null;
		try (FileInputStream fis = new FileInputStream(absoluteOutPath)) {
			workbook = new XSSFWorkbook(fis);
			XSSFSheet sheet = workbook.getSheet("SpecifyBase64Cells");
			if (sheet == null) {
				return;
			}
			Map<Integer, Map<Integer, List<Integer>>> mapCellJump = new HashMap<>();
			int endRow = sheet.getLastRowNum();
			for (int rowIndex = 0; rowIndex <= endRow; rowIndex++) {
				Row row = sheet.getRow(rowIndex);
				Double numberJumping = row.getCell(1).getNumericCellValue();
				if (numberJumping.intValue() < 1) {
					mapCellJump.put(rowIndex, null);
					continue;
				}
				Map<Integer, List<Integer>> mapJumping = new HashMap<>();
				List<Integer> listJumping = new ArrayList<>();
				for (int i = 0; i < (numberJumping.intValue() - 1); i++) {
					Double jumpingValue = row.getCell(i + 3).getNumericCellValue();
					listJumping.add(jumpingValue.intValue());
				}
				Double startJumping = row.getCell(2).getNumericCellValue();
				mapJumping.put(startJumping.intValue(), listJumping);
				mapCellJump.put(rowIndex, mapJumping);
			}
			Jxls2xTransformerUtils.resolveBase64(workbook, mapCellJump, resultSheetIndex,
					mapBeanParams.get("objData") == null ? null : (List<List<Object>>) mapBeanParams.get("objData"));
		} catch (Exception e) {
			Jxls2xTransformerUtils.log.error(e.getMessage(), e);
		}
		if (workbook != null) {
			try (FileOutputStream fos = new FileOutputStream(absoluteOutPath)) {
				workbook.write(fos);
				workbook.close();
			} catch (IOException e) {
				Jxls2xTransformerUtils.log.error(e.getMessage(), e);
			}
		}
	}

	private static void resolveBase64(XSSFWorkbook workbook, Map<Integer, Map<Integer, List<Integer>>> mapCellJumping,
			int resultSheetIndex, List<List<Object>> qrCodes) throws IllegalAccessException {
		if (qrCodes == null) {
			return;
		}
		XSSFSheet sheet = workbook.getSheetAt(resultSheetIndex);
		int beginRow = sheet.getFirstRowNum();
		int endRow = sheet.getLastRowNum();
		sheet.createRow(endRow + 1);
		for (int rowIndex = beginRow; rowIndex <= endRow; rowIndex++) {
			Row row = sheet.getRow(rowIndex);
			if (row == null) {
				continue;
			}
			int beginCol = row.getFirstCellNum();
			int endCol = row.getLastCellNum();
			if (mapCellJumping.get(1) != null) {
				Map<Integer, List<Integer>> mapJumping = mapCellJumping.get(1);
				beginCol = mapJumping.keySet().iterator().next();
				endCol = beginCol + mapJumping.get(beginCol).parallelStream().mapToInt(Integer::intValue).sum();
			}
			for (int colIndex = beginCol; colIndex <= endCol; colIndex++) {
				Cell cell = row.getCell(colIndex);
				Map<String, Object> mapObj = Jxls2xTransformerUtils.getMapObj(cell, qrCodes);
				if (mapObj == null) {
					continue;
				}
				Jxls2xTransformerUtils.drawQrCodeFromBase64(workbook, sheet, new DrawBase64Dto(
						mapObj.get("qRCode").toString(), colIndex, rowIndex, colIndex + 1, rowIndex + 1));
				cell.setCellValue("");
			}
		}
	}

	private static Map<String, Object> getFieldNamesAndValues(final Object obj, boolean publicOnly)
			throws IllegalAccessException {
		Class<? extends Object> c1 = obj.getClass();
		Map<String, Object> map = new HashMap<>();
		Field[] fields = c1.getDeclaredFields();
		for (int i = 0; i < fields.length; i++) {
			Field field = fields[i];
			String name = field.getName();
			if (publicOnly) {
				if (Modifier.isPublic(field.getModifiers())) {
					Object value = field.get(obj);
					map.put(name, value);
				}
			} else {
				field.setAccessible(true);
				Object value = field.get(obj);
				map.put(name, value);
			}
		}
		return map;
	}

	private static Map<String, Object> getMapObj(Cell cell, List<List<Object>> qrCodes) throws IllegalAccessException {
		if ((cell == null) || !CellType.STRING.equals(cell.getCellType())) {
			return null;
		}
		String value = String.valueOf(cell);
		if (!value.startsWith("[") || !value.endsWith("]")) {
			return null;
		}
		String[] cellIndex = value.replace("[", "").replace("]", "").split("-");
		if ((cellIndex.length != 2) || !StringUtils.isNumeric(cellIndex[0]) || !StringUtils.isNumeric(cellIndex[1])) {
			return null;
		}
		Object obj = qrCodes.get(Integer.parseInt(cellIndex[0])).get(Integer.parseInt(cellIndex[1]));
		Map<String, Object> mapObj = Jxls2xTransformerUtils.getFieldNamesAndValues(obj, false);
		if (!mapObj.containsKey("qRCode")) {
			return null;
		}
		return mapObj;
	}

	private static void drawQrCodeFromBase64(XSSFWorkbook workbook, XSSFSheet sheet, DrawBase64Dto drawBase64Dto) {
		final int pictureIndex = workbook.addPicture(Base64.getDecoder().decode(drawBase64Dto.getBase64()),
				Workbook.PICTURE_TYPE_PNG);

		final XSSFDrawing drawing = sheet.createDrawingPatriarch();
		int padding = 5;
		XSSFClientAnchor anchor = new XSSFClientAnchor(padding * Units.EMU_PER_PIXEL, padding * Units.EMU_PER_PIXEL,
				-padding * Units.EMU_PER_PIXEL, -padding * Units.EMU_PER_PIXEL, drawBase64Dto.getBeginColIndex(),
				drawBase64Dto.getBeginRowIndex(), drawBase64Dto.getEndColIndex(), drawBase64Dto.getEndRowIndex());
		anchor.setAnchorType(ClientAnchor.AnchorType.DONT_MOVE_AND_RESIZE);
		drawing.createPicture(anchor, pictureIndex);
	}

	public static void addComment(String absoluteOutPath, String resultSheetName, List<CommentDto> commentDtos) {
		XSSFWorkbook workbook = null;
		try (FileInputStream fis = new FileInputStream(absoluteOutPath)) {
			workbook = new XSSFWorkbook(fis);
			XSSFSheet sheet = workbook.getSheet(resultSheetName);
			for (CommentDto commentDto : commentDtos) {
				int rowIdx = commentDto.getRowIndex();
				int colIdx = commentDto.getColIndex();
				CreationHelper factory = workbook.getCreationHelper();
				Row row = sheet.getRow(rowIdx);
				if (row == null) {
					row = sheet.createRow(rowIdx);
				}
				Cell cell = row.getCell(colIdx);
				if (cell == null) {
					cell = row.createCell(colIdx);
				}
				ClientAnchor anchor = factory.createClientAnchor();
				anchor.setCol1(cell.getColumnIndex() + 1);
				anchor.setCol2(cell.getColumnIndex() + 1 + commentDto.getColPlus());
				anchor.setRow1(rowIdx + 1);
				anchor.setRow2(rowIdx + 1 + commentDto.getRowPlus());
				XSSFDrawing drawing = sheet.createDrawingPatriarch();
				Comment comment = drawing.createCellComment(anchor);
				comment.setString(factory.createRichTextString(commentDto.getComment()));
				comment.setAuthor(commentDto.getAuthor());
				cell.setCellComment(comment);
			}
		} catch (IOException e) {
			Jxls2xTransformerUtils.log.error(e.getMessage(), e);
		}
		if (workbook != null) {
			try (FileOutputStream fos = new FileOutputStream(absoluteOutPath)) {
				workbook.write(fos);
				workbook.close();
			} catch (IOException e) {
				Jxls2xTransformerUtils.log.error(e.getMessage(), e);
			}
		}
	}

	public static class DrawBase64Dto {
		private String base64;
		private int beginColIndex;
		private int beginRowIndex;
		private int endColIndex;
		private int endRowIndex;

		public DrawBase64Dto() {
		}

		public DrawBase64Dto(String base64, int beginColIndex, int beginRowIndex, int endColIndex, int endRowIndex) {
			this.base64 = base64;
			this.beginColIndex = beginColIndex;
			this.beginRowIndex = beginRowIndex;
			this.endColIndex = endColIndex;
			this.endRowIndex = endRowIndex;
		}

		public String getBase64() {
			return this.base64;
		}

		public void setBase64(String base64) {
			this.base64 = base64;
		}

		public int getBeginColIndex() {
			return this.beginColIndex;
		}

		public void setBeginColIndex(int beginColIndex) {
			this.beginColIndex = beginColIndex;
		}

		public int getBeginRowIndex() {
			return this.beginRowIndex;
		}

		public void setBeginRowIndex(int beginRowIndex) {
			this.beginRowIndex = beginRowIndex;
		}

		public int getEndColIndex() {
			return this.endColIndex;
		}

		public void setEndColIndex(int endColIndex) {
			this.endColIndex = endColIndex;
		}

		public int getEndRowIndex() {
			return this.endRowIndex;
		}

		public void setEndRowIndex(int endRowIndex) {
			this.endRowIndex = endRowIndex;
		}

	}

	public static class CommentDto {
		private int rowIndex;
		private int rowPlus;
		private int colIndex;
		private int colPlus;
		private String author;
		private String comment;

		public CommentDto(int rowIndex, int rowPlus, int colIndex, int colPlus, String author, String comment) {
			super();
			this.rowIndex = rowIndex;
			this.rowPlus = rowPlus;
			this.colIndex = colIndex;
			this.colPlus = colPlus;
			this.author = author;
			this.comment = comment;
		}

		public int getRowIndex() {
			return this.rowIndex;
		}

		public void setRowIndex(int rowIndex) {
			this.rowIndex = rowIndex;
		}

		public int getRowPlus() {
			return this.rowPlus;
		}

		public void setRowPlus(int rowPlus) {
			this.rowPlus = rowPlus;
		}

		public int getColIndex() {
			return this.colIndex;
		}

		public void setColIndex(int colIndex) {
			this.colIndex = colIndex;
		}

		public int getColPlus() {
			return this.colPlus;
		}

		public void setColPlus(int colPlus) {
			this.colPlus = colPlus;
		}

		public String getAuthor() {
			return this.author;
		}

		public void setAuthor(String author) {
			this.author = author;
		}

		public String getComment() {
			return this.comment;
		}

		public void setComment(String comment) {
			this.comment = comment;
		}

	}
}
