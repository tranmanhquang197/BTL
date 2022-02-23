package com.tsolution.utils;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelTo {
	private ExcelTo() {
	}

	private static Logger logger = LogManager.getLogger(ExcelTo.class);

	public static String pdf(String libreOfficePath, String inputFilePath, String outputPath) {
		XSSFWorkbook workbook = null;
		try (FileInputStream fis = new FileInputStream(inputFilePath)) {
			workbook = new XSSFWorkbook(fis);
			for (int i = workbook.getNumberOfSheets() - 1; i >= 0; i--) {
				if (workbook.isSheetHidden(i)) {
					workbook.removeSheetAt(i);
				}
			}
		} catch (IOException e) {
			ExcelTo.logger.error(e.getMessage(), e);
		}
		if (workbook != null) {
			try (FileOutputStream fos = new FileOutputStream(inputFilePath)) {
				workbook.write(fos);
				workbook.close();
			} catch (IOException e) {
				ExcelTo.logger.error(e.getMessage(), e);
			}
		}

		try {
			Process process = new ProcessBuilder(libreOfficePath + "soffice", "--invisible", "--headless",
					"--convert-to", "pdf:calc_pdf_Export", inputFilePath, "--outdir", outputPath).start();
			StringBuilder output = new StringBuilder();

			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line + "\n");
			}
			ExcelTo.logger.info(output);
			process.waitFor();
		} catch (InterruptedException e) {
			ExcelTo.logger.error(e.getMessage(), e);
			Thread.currentThread().interrupt();
		} catch (IOException e) {
			ExcelTo.logger.error(e.getMessage(), e);
		}
		return inputFilePath.replace("xlsx", "pdf");
	}

}
