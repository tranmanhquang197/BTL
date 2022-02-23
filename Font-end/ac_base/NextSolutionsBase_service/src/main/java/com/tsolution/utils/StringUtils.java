package com.tsolution.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.web.client.HttpStatusCodeException;

public class StringUtils {

	private static Logger log = LogManager.getLogger(StringUtils.class);

	private StringUtils() {
	}

	public static boolean isNullOrEmpty(String s) {
		return (s == null) || "".equalsIgnoreCase(s.trim());
	}

	public static boolean isNumber(String str) {
		if (str == null) {
			return false;
		}
		int length = str.length();
		if (length == 0) {
			return false;
		}
		int i = 0;
		if (str.charAt(0) == '-') {
			if (length == 1) {
				return false;
			}
			i = 1;
		}
		for (; i < length; i++) {
			char c = str.charAt(i);
			if ((c < '0') || (c > '9')) {
				return false;
			}
		}
		return true;
	}

	public static String getExceptionMessage(HttpStatusCodeException httpStatusCodeException) {
		StringUtils.log.error(httpStatusCodeException.getResponseBodyAsString());
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(httpStatusCodeException.getResponseBodyAsString());
		} catch (JSONException e) {
			StringUtils.log.error(e.getMessage(), e);
			return "";
		}
		String message = "";
		try {
			message = jsonObject.getString("message");
		} catch (JSONException e) {
			StringUtils.log.error(e.getMessage(), e);
		}
		return message;
	}

	public static String padRight(String s, int n) {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("%-");
		stringBuilder.append(n);
		stringBuilder.append("s");
		return String.format(stringBuilder.toString(), s);
	}

	public static String padLeft(String s, int n) {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("%");
		stringBuilder.append(n);
		stringBuilder.append("s");
		return String.format(stringBuilder.toString(), s);
	}
}
