package com.tsolution.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.util.Units;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;

import net.sf.jxls.transformer.XLSTransformer;

public class JxlsTransformerUtils {
	private JxlsTransformerUtils() {
	}

	private static Logger log = LogManager.getLogger(JxlsTransformerUtils.class);

	public static Integer getChunkSize(String relativeTemplatePath) throws IOException {
		try (InputStream inputStream = new ClassPathResource(relativeTemplatePath).getInputStream();
				XSSFWorkbook workbook = new XSSFWorkbook(new BufferedInputStream(inputStream));) {
			XSSFSheet sheet = workbook.getSheet("SpecifyBase64Cells");
			if (sheet == null) {
				return null;
			}
			Double value = sheet.getRow(1).getCell(1).getNumericCellValue();
			return value.intValue();
		}
	}

	public static String transformer(String relativeTemplatePath, Map<String, Object> mapBeanParams, String outPath,
			String fileName) throws Exception {
		InputStream inputStream = new ClassPathResource(relativeTemplatePath).getInputStream();
		if (inputStream.available() < 0) {
			return null;
		}
		if (fileName == null) {
			fileName = new SimpleDateFormat("yyyyMMdd-HHmmssSSS").format(new Date()) + "_"
					+ relativeTemplatePath.substring(relativeTemplatePath.lastIndexOf('/') + 1);// + file.getName()
		}
		String absoluteOutPath = Paths.get(Paths.get(outPath).toString(), fileName).toString();

		try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(absoluteOutPath));) {
			XLSTransformer transformer = new XLSTransformer();
			XSSFWorkbook workbook = (XSSFWorkbook) transformer.transformXLS(inputStream, mapBeanParams);

			XSSFSheet sheet = workbook.getSheet("SpecifyBase64Cells");
			if (sheet != null) {
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
				try {
					JxlsTransformerUtils.resolveBase64(workbook, mapCellJump,
							mapBeanParams.get("objData") == null ? null
									: (List<List<Object>>) mapBeanParams.get("objData"));
				} catch (Exception e) {
					JxlsTransformerUtils.log.error(e.getMessage(), e);
				}
			}
			workbook.write(outputStream);
			outputStream.flush();
			return absoluteOutPath;
		}

	}

	private static void resolveBase64(XSSFWorkbook workbook, Map<Integer, Map<Integer, List<Integer>>> mapCellJumping,
			List<List<Object>> qrCodes) throws IllegalAccessException {
		if (qrCodes == null) {
			return;
		}
		XSSFSheet sheet = workbook.getSheetAt(0);
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
				if ((cell == null) || !CellType.STRING.equals(cell.getCellType())) {
					continue;
				}
				String value = String.valueOf(cell);
				if (!value.startsWith("[") || !value.endsWith("]")) {
					continue;
				}
				String[] cellIndex = value.replaceAll("\\[", "").replaceAll("\\]", "").split("-");
				if ((cellIndex.length != 2) || !StringUtils.isNumeric(cellIndex[0])
						|| !StringUtils.isNumeric(cellIndex[1])) {
					continue;
				}
				Object obj = qrCodes.get(Integer.parseInt(cellIndex[0])).get(Integer.parseInt(cellIndex[1]));
				Map<String, Object> mapObj = JxlsTransformerUtils.getFieldNamesAndValues(obj, false);
				if (!mapObj.containsKey("qRCode")) {
					continue;
				}
				final int pictureIndex = workbook.addPicture(
						Base64.getDecoder().decode(mapObj.get("qRCode").toString()), Workbook.PICTURE_TYPE_PNG);

				final XSSFDrawing drawing = sheet.createDrawingPatriarch();
				int padding = 5;
				XSSFClientAnchor anchor = new XSSFClientAnchor(padding * Units.EMU_PER_PIXEL,
						padding * Units.EMU_PER_PIXEL, -padding * Units.EMU_PER_PIXEL, -padding * Units.EMU_PER_PIXEL,
						colIndex, rowIndex, colIndex + 1, rowIndex + 1);
				anchor.setAnchorType(ClientAnchor.AnchorType.DONT_MOVE_AND_RESIZE);
				drawing.createPicture(anchor, pictureIndex);
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
			String name = fields[i].getName();
			if (publicOnly) {
				if (Modifier.isPublic(fields[i].getModifiers())) {
					Object value = fields[i].get(obj);
					map.put(name, value);
				}
			} else {
				fields[i].setAccessible(true);
				Object value = fields[i].get(obj);
				map.put(name, value);
			}
		}
		return map;
	}

	public static String transformer(String relativeTemplatePath, Map<String, Object> mapBeanParams, String outPath,
			String fileName, Map<Integer, List<Integer>> mapBase64) throws Exception {
		String absoluteTempOutPath = JxlsTransformerUtils.transformer(relativeTemplatePath, mapBeanParams, outPath,
				fileName + "_temp");
		if (absoluteTempOutPath == null) {
			return absoluteTempOutPath;
		}
		String absoluteOutPath = absoluteTempOutPath.replace("_temp", "");
		try (InputStream inputStream = new FileInputStream(absoluteTempOutPath);
				OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(absoluteOutPath));
				XSSFWorkbook workbook = new XSSFWorkbook(inputStream);) {
			XSSFSheet sheet = workbook.getSheetAt(0);
			final XSSFDrawing drawing = sheet.createDrawingPatriarch();
			int padding = 5;
			for (Map.Entry<Integer, List<Integer>> entry : mapBase64.entrySet()) {
				Integer rowIndex = entry.getKey();
				Row row = sheet.getRow(rowIndex);
				List<Integer> colIndexes = entry.getValue();
				for (Integer colIndex : colIndexes) {
					Cell cell = row.getCell(colIndex);
					String value = cell.getStringCellValue();
					final int pictureIndex = workbook.addPicture(Base64.getDecoder().decode(value),
							Workbook.PICTURE_TYPE_PNG);
					XSSFClientAnchor anchor = new XSSFClientAnchor(padding * Units.EMU_PER_PIXEL,
							padding * Units.EMU_PER_PIXEL, -padding * Units.EMU_PER_PIXEL,
							-padding * Units.EMU_PER_PIXEL, colIndex, rowIndex, colIndex + 1, rowIndex + 1);
					anchor.setAnchorType(ClientAnchor.AnchorType.DONT_MOVE_AND_RESIZE);
					drawing.createPicture(anchor, pictureIndex);
					cell.setCellValue("");
				}
			}
			workbook.write(outputStream);
			outputStream.flush();
			try {
				Files.deleteIfExists(Paths.get(absoluteTempOutPath));
			} catch (Exception e) {
				JxlsTransformerUtils.log.error(e.getMessage(), e);
			}
		}
		return absoluteOutPath;
	}
}
