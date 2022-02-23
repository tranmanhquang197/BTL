package com.tsolution.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.EnumMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

public class QRCodeGenerator {
	private static final Logger logger = LogManager.getLogger(QRCodeGenerator.class);

	private QRCodeGenerator() {
	}

	// http://beautifytools.com/base64-to-image-converter.php
	public static String generate(String content) {
		// Gen QR-Code Code là Unique
		try {
			EnumMap<EncodeHintType, Object> hintMap = new EnumMap<>(EncodeHintType.class);
			hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
			hintMap.put(EncodeHintType.CHARACTER_SET, "UTF-8");
			hintMap.put(EncodeHintType.MARGIN, 0);
			QRCodeWriter qrCodeWriter = new QRCodeWriter();
			BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, Constants.QR_CODE_SIZE,
					Constants.QR_CODE_SIZE, hintMap);
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			// 0xFFFFA500 new MatrixToImageConfig(0xFFFFFFFF, 0xFF000000)
			MatrixToImageWriter.writeToStream(bitMatrix, "PNG", os);
			return Base64.getEncoder().encodeToString(os.toByteArray());
		} catch (WriterException | IOException e) {
			QRCodeGenerator.logger.error(e.getMessage(), e);
			return null;
		}
	}

//	public static void main(String[] args)
//		System.out.println(QRCodeGenerator.generate("1st-Floor"))
//		System.out.println(QRCodeGenerator.generate("receive_1st-Floor"))
//		System.out.println(QRCodeGenerator.generate("repacking_1st-Floor"))
//		System.out.println(QRCodeGenerator.generate("store_1st-Floor"))
//
}
