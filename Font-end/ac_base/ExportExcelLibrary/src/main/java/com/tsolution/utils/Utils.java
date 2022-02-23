package com.tsolution.utils;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.math.BigDecimal;
import java.text.MessageFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Utils {

	public static final String DATE_FORMAT_EXCEL_FILE = "yyyyMMdd-HHmmss";
	public static final String DATE_FORMAT_REPORT = "dd/MM/yyyy";

	public static boolean isEmpty(List list) {
		return (list == null) || list.isEmpty();
	}

	public static boolean isNotEmpty(List list) {
		return (list != null) && !list.isEmpty();
	}

	public static List safe(List other) {

		return other == null ? Collections.EMPTY_LIST : other;
	}

	public static Set safe(Set other) {

		return other == null ? Collections.EMPTY_SET : other;
	}

	public static Map safe(Map other) {

		return other == null ? Collections.EMPTY_MAP : other;
	}

	public static LocalDateTime getLocalDatetime() {
		return LocalDateTime.now();
	}

	public static <T> T getData(Object src, Class<T> clazz) throws Exception {
		return Utils.getData(src, clazz, null);
	}

	public static <T> T getData(Object src, Class<T> clazz, HashMap<String, Field> destFields) throws Exception {
		Field[] fields = src.getClass().getDeclaredFields();

		T dest = clazz.newInstance();
		Field fieldDest;
		if (destFields == null) { // == null nghia la chi dung cho noi tai trong ham
			destFields = new HashMap<>();
		}
		for (Field field : dest.getClass().getDeclaredFields()) {
			destFields.put(field.getName(), field);
		}

		for (Field field : fields) {
			int modifier = field.getModifiers();
			if (Modifier.isStatic(modifier) || Modifier.isFinal(modifier)) {
				continue;
			}

			field.setAccessible(true);
			Object value = field.get(src);

			fieldDest = destFields.get(field.getName());
			if ((fieldDest == null) || (fieldDest.getType() != field.getType())) {
				continue;
			}
			fieldDest.setAccessible(true);
			fieldDest.set(dest, value);

		}
		return dest;
	}

	public static List<Field> getAllFields(List<Field> fields, Class<?> type) {
		fields.addAll(Arrays.asList(type.getDeclaredFields()));

		if (type.getSuperclass() != null) {
			Utils.getAllFields(fields, type.getSuperclass());
		}

		return fields;
	}

	public static StringBuilder buildWhere(Object obj, String alias, HashMap params) throws Exception {
		StringBuilder builder = new StringBuilder();
//		Field[] fields = obj.getClass().getDeclaredFields();

		List<Field> fields = new ArrayList<>();
		Utils.getAllFields(fields, obj.getClass());
		int modifier;
		if (!Utils.isEmpty(alias) && !alias.endsWith(".")) {
			alias = alias.trim() + ".";
		}
		for (Field field : fields) {

			modifier = field.getModifiers();
			if (Modifier.isFinal(modifier) || Modifier.isStatic(modifier)
					|| field.getName().equalsIgnoreCase("_displayCols")) {
				continue;
			}
			field.setAccessible(true);
			Object value = field.get(obj);
			if ((value == null) || Utils.isEmpty(value)) {
				continue;
			}
			if (field.getName().equalsIgnoreCase("ORDER_BY")) {
				params.put("ORDER_BY", value);
				continue;
			}

//			if(field.getName().equalsIgnoreCase("_TEXT") ){
//				Map m = ((BaseDto)obj).getTextCondition(alias);
//				builder.append(" and (").append((String)m.get("_CONDITION_")).append(") ");
//				m.remove("_CONDITION_");
//				if(m != null) {
//					params.putAll(m);
//				}
//				continue;
//			}

			if (value != null) {
				if (value instanceof String) {
					builder.append(" and (").append(alias).append(field.getName()).append(" LIKE CONCAT('%',:")
							.append(field.getName()).append(",'%'))");
				} else {
					builder.append(" and (").append(alias).append(field.getName()).append(" =:").append(field.getName())
							.append(")");
				}
				params.put(field.getName(), value);
			}

		}
		return builder;
	}

	public static HashMap getOtherCond(Object obj) throws Exception {

		HashMap<String, Object> cond = new HashMap<>();
		Field[] fields = obj.getClass().getSuperclass().getDeclaredFields();

		int modifier;

		for (Field field : fields) {

			modifier = field.getModifiers();
			if (Modifier.isFinal(modifier) || Modifier.isStatic(modifier)) {
				continue;
			}
			field.setAccessible(true);
			Object value = field.get(obj);
			cond.put(field.getName(), value);

		}
		return cond;
	}

	public static boolean isEmpty(String str) {
		return ((str == null) || "".equals(str.trim()));
	}

	public static boolean isEmpty(Object str) {
		return ((str == null) || "".equals(str));
	}

	public static String getStackTrace(Throwable e) {
		Writer sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		e.printStackTrace(pw);
		String stacktrace = sw.toString();
		pw.close();
		return stacktrace;
	}

	public static LocalDateTime tryToDate(String strDate) {
		LocalDateTime retDate;
		String[] dateFormat = { "dd/MM/yyyy", "dd-MM-yyyy", "dd/MM/yyyy HH:mm:ss", "dd-MM-yyyy HH:mm:ss" };
		for (String s : dateFormat) {
			retDate = Utils.toDate(strDate, s);
			if (retDate != null) {
				return retDate;
			}
		}
		return null;
	}

	public static Long tryToLong(String strLong) {
		try {
			return Long.parseLong(strLong);
		} catch (NumberFormatException ex) {
			return null;
		}

	}

	public static Double tryToDouble(String strDouble) {
		try {
			return Double.parseDouble(strDouble);
		} catch (NumberFormatException ex) {
			return null;
		}

	}

	public static LocalDateTime toDate(String strDate, String format) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
		try {

			LocalDateTime dateTime = LocalDateTime.parse(strDate, formatter);
			return dateTime;
		} catch (Exception ex) {
			try {
				LocalDate date = LocalDate.parse(strDate, formatter);
				return date.atTime(0, 0, 0);
			} catch (Exception ex1) {
				return null;
			}
		}
	}

	public static boolean isNullOrEmpty(String s) {
		return (s == null) || "".equalsIgnoreCase(s.trim());
	}

	public static boolean isNumberWithDecimal(final String s) {
		try {
			new BigDecimal(s);

			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	public static String toDateString(Date date, String format) {
		String dateString = "";
		if (date == null) {
			return dateString;
		}
		Object[] params = new Object[] { date };

		try {
			dateString = MessageFormat.format("{0,date," + format + "}", params);
		} catch (NullPointerException | IllegalArgumentException e) {
			e.printStackTrace();
		}
		return dateString;
	}

	public static String toDateString(LocalDateTime date, String format) {
		if (date == null) {
			return "";
		}
		Date out = Date.from(date.atZone(ZoneId.systemDefault()).toInstant());
		return Utils.toDateString(out, format);
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
}
