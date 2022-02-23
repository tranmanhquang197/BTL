package com.tsolution.utils;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Date;


public class LogUtilityCommon {
	private static Logger serverErrorLog = LogManager.getLogger("com.viettel.kunkun.log.error.server");
	private static Logger clientErrorLog = LogManager.getLogger("com.viettel.kunkun.log.error.client");
	
	private static Logger perfLog = LogManager.getLogger("com.viettel.kunkun.log.perf");
	

	public static void logError(Throwable e, String message) {
		if(serverErrorLog.isErrorEnabled()){
			StringBuilder sb = new StringBuilder();
//			sb.append("\"").append(Configuration.getAppName()).append("\",");
			sb.append("\"").append(toCSVCell(message)).append("\",");
			
			sb.append("\"");
			if(e != null) {
				sb.append(e.getMessage()).append("\n");
				StackTraceElement[] st = e.getStackTrace();
				for(int i = 0; i < st.length; i++) {
					sb.append(st[i]).append("\n");
				}
			}
			sb.append("\"");
			
			serverErrorLog.error(sb.toString());
		}
	}

	public static void logMobileClientError(String platform, String model,
			String version, String errName, String description) {
		if (clientErrorLog.isErrorEnabled()) {
			StringBuilder sb = new StringBuilder();
			sb.append("\"").append(platform).append("\",");
			sb.append("\"").append(model).append("\",");
			sb.append("\"").append(toCSVCell(errName)).append("\",");
			sb.append("\"").append(toCSVCell(description)).append("\",");
			sb.append("\"").append(new Date()).append("\",");
			sb.append("\"").append(version).append("\"");

			clientErrorLog.error(sb.toString());
		}
	}
	
	public static void logPerf(String func, String duration) {
		if (perfLog.isErrorEnabled()) {
			StringBuilder sb = new StringBuilder();
			sb.append("\"").append(func).append("\",");
			sb.append("\"").append(duration).append("\",");
			sb.append("\"").append(new Date()).append("\"");

			perfLog.info(sb.toString());
		}
	}

	private static String toCSVCell(String input) {
		return input.replaceAll("\"", "\"\"");
	}
	
	
	
}
