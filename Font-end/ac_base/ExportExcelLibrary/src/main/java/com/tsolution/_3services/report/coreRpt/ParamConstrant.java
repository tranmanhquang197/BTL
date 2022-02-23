package com.tsolution._3services.report.coreRpt;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.tsolution.utils.LogUtilityCommon;
import com.tsolution.utils.Utils;

public class ParamConstrant implements Serializable {
	private static final long serialVersionUID = 1L;
	private static final String DATE_FORMAT_ATTRIBUTE = "yyyy-MM-dd";
	private static final String DATE_FORMAT_STR = "dd/MM/yyyy";
//	CHARACTER (1),
//
//    NUMBER (2),
//
//    DATE_TIME (3),
//
//	CHOICE (4),
//
//	MULTI_CHOICE (5),
//
//	LOCATION(6);

	public static final int STRING = 1;
	public static final int NUMBER = 2;
	public static final int DATE = 3;
	public static final int MONTH = 7;
	public static final int QUARTER = 8;
	public static final List<String> quarterConstant = Arrays.asList("q1", "q2", "q3", "q4");

	private Object paramName;
	private Object maxId;
	private Object maxValue;
	private boolean required;
	private Integer isRequire;
	private int type;

	public ParamConstrant(Object paramName, Object maxId, Object maxValue, boolean required, int type) {
		this.paramName = paramName;
		this.maxId = maxId;
		this.maxValue = maxValue;
		this.required = required;
		this.type = type;
	}

	public static String getValueStr(int type, String value) {
		if ((value == null) || "null".equals(value)) {
			return null;
		}
		Date date;
		String[] tmp;
		System.out.println("value1:" + type + "--" + value);
		try {
			switch (type) {
			case ParamConstrant.STRING:
				return value;
			case ParamConstrant.DATE:
				System.out.println("1");
				date = ParamConstrant.toDate(value, ParamConstrant.DATE_FORMAT_STR);
				System.out.println("2");
				if (date == null) {
					System.out.println("3");
					return null;
				}
				System.out.println("4");
				return ParamConstrant.toDateString(date, ParamConstrant.DATE_FORMAT_ATTRIBUTE);
			case ParamConstrant.NUMBER:
				return StringUtils.leftPad(value, 20);
			case ParamConstrant.MONTH:
				date = ParamConstrant.toDate("01/" + value, ParamConstrant.DATE_FORMAT_STR);
				if (date == null) {
					return null;
				}
				return Utils.toDateString(date, ParamConstrant.DATE_FORMAT_ATTRIBUTE);
			case ParamConstrant.QUARTER:
				tmp = value.split(" ");
				if (tmp.length != 2) {
					return null;
				}
				boolean contains = ParamConstrant.quarterConstant.contains(tmp[0].toLowerCase());
				if (!contains) {
					return null;
				}
				Long year = Long.valueOf(tmp[1]);
				if (year < 2000) {
					return null;
				}
				return tmp[1] + tmp[0];

			}

			return value;
		} catch (Exception e) {
			e.printStackTrace();
			LogUtilityCommon.logError(e, e.getMessage());
			return null;
		}

	}

	public static Date toDate(String dateStr, String format) {
		Date date = null;
		try {
			DateFormat dateFormat = new SimpleDateFormat(format);
			date = dateFormat.parse(dateStr);
		} catch (Exception e) {
			e.printStackTrace();
			LogUtilityCommon.logError(e, e.getMessage());
		}
		return date;
	}

	public static String toDateString(Date date, String format) {
		String dateString = "";
		if (date == null) {
			return dateString;
		}
		Object[] params = new Object[] { date };

		try {
			dateString = MessageFormat.format("{0,date," + format + "}", params);
		} catch (Exception e) {
			throw e;
		}
		return dateString;
	}

	public Object getParamName() {
		return this.paramName;
	}

	public void setParamName(Object paramName) {
		this.paramName = paramName;
	}

	public Object getMaxId() {
		return this.maxId;
	}

	public void setMaxId(Object maxId) {
		this.maxId = maxId;
	}

	public Object getMaxValue() {
		return this.maxValue;
	}

	public void setMaxValue(Object maxValue) {
		this.maxValue = maxValue;
	}

	public boolean isRequired() {
		return this.required;
	}

	public void setRequired(boolean required) {
		this.required = required;
	}

	public int getType() {
		return this.type;
	}

	public void setType(int type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return "ParamConstrant [paramName=" + this.paramName + ", maxId=" + this.maxId + ", maxValue=" + this.maxValue
				+ ", required=" + this.required + ", type=" + this.type + "]";
	}

	public Integer getIsRequire() {
		return this.isRequire;
	}

	public void setIsRequire(Integer isRequire) {
		this.isRequire = isRequire;
	}

}
