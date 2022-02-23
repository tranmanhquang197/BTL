package com.tsolution.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.EnumMap;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.oned.EAN13Writer;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

public class CodeGenerator {
	private CodeGenerator() {
	}

	public static final short EXCEL_COLUMN_WIDTH_FACTOR = 256;

	public static final short EXCEL_ROW_HEIGHT_FACTOR = 20;
	public static final int UNIT_OFFSET_LENGTH = 7;

	public static int columnWidthToPixels(int width) {
		int pixels = (width / CodeGenerator.EXCEL_COLUMN_WIDTH_FACTOR) * CodeGenerator.UNIT_OFFSET_LENGTH;

		int offsetWidthUnits = width % CodeGenerator.EXCEL_COLUMN_WIDTH_FACTOR;
		pixels += Math.round(offsetWidthUnits
				/ ((float) CodeGenerator.EXCEL_COLUMN_WIDTH_FACTOR / CodeGenerator.UNIT_OFFSET_LENGTH));

		return pixels;
	}

	public static int rowHeightToPixels(int height) {
		int pixels = (height / CodeGenerator.EXCEL_ROW_HEIGHT_FACTOR);
		int offsetWidthUnits = height % CodeGenerator.EXCEL_ROW_HEIGHT_FACTOR;
		pixels += Math.floor(
				offsetWidthUnits / ((float) CodeGenerator.EXCEL_ROW_HEIGHT_FACTOR / CodeGenerator.UNIT_OFFSET_LENGTH));
		return pixels;
	}

	public static byte[] toBarcodeEAN13(String barcode, int width, int height) {
		try {
			EnumMap<EncodeHintType, Object> hintMap = new EnumMap<>(EncodeHintType.class);
			hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
			hintMap.put(EncodeHintType.CHARACTER_SET, "UTF-8");
			hintMap.put(EncodeHintType.MARGIN, 1);
			EAN13Writer ean13Writer = new EAN13Writer();
			BitMatrix bitMatrix = ean13Writer.encode(barcode, BarcodeFormat.EAN_13,
					CodeGenerator.columnWidthToPixels(width), CodeGenerator.rowHeightToPixels(height), hintMap);
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			MatrixToImageWriter.writeToStream(bitMatrix, "PNG", os, new MatrixToImageConfig(0xFFFFA500, 0xFFFFFFFF));
			return os.toByteArray();
		} catch (WriterException | IOException e) {
			System.err.println(e);
			return null;
		}
	}
}
