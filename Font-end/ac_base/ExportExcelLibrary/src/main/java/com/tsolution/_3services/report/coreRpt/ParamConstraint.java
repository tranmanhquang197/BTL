package com.tsolution._3services.report.coreRpt;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;

//import com.viettel.core.entities.ApParam;



public class ParamConstraint implements Serializable{
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
	public static final int SHOP_ID = 9;
	public static final List<String> quarterConstant = Arrays.asList("q1", "q2", "q3", "q4");

	private String paramId;	
	private String paramName;
	private String maxId;
	private String maxValue;
	private String minValue;
	
	private Integer isRequire;
	private Integer valueType;
	
	private String dataSrc;
//	private List<ApParam> lstDataSrc;
	
	private String paramValue;
	private String defaultValue;
	
	public ParamConstraint() {
		
	}
	
	public ParamConstraint(String paramName, String maxId, String maxValue, Integer required, int type) {
		this.paramName = paramName;
		this.maxId = maxId;
		this.maxValue = maxValue;
		this.isRequire = required;
		this.valueType = type;
	}
	
	
	public static String getValueStr(int type, String value) {
		if(value == null || "null".equals(value)) {
			return null;
		}
		Date date ;
		String[] tmp;
		System.out.println("value1:" + type + "--" + value);
		try {
			switch(type) {
			case ParamConstraint.STRING:
				return value;
			case ParamConstraint.DATE:
				System.out.println("1");
				 date = toDate(value, DATE_FORMAT_STR);
				 System.out.println("2");
				if(date == null) {
					System.out.println("3");
					return null;
				}
				System.out.println("4");
				return toDateString(date, DATE_FORMAT_ATTRIBUTE);
			case ParamConstraint.NUMBER:
				return StringUtils.leftPad(value, 20);
			case ParamConstraint.MONTH:
				 date = toDate("01/" + value, DATE_FORMAT_STR);
				if(date == null) {
					return null;
				}
				return toDateString(date, DATE_FORMAT_ATTRIBUTE);
			case ParamConstraint.QUARTER:
				tmp = value.split(" ");
				if(tmp.length != 2) {
					return null;
				}
				boolean contains = ParamConstraint.quarterConstant.contains(tmp[0].toLowerCase());
				if(!contains) {
					return null;
				}
				Long year = Long.valueOf(tmp[1]);
				if(year < 2000) {
					return null;
				}
				return tmp[1]+tmp[0];
				
			
			}
			
			return null;
		}
		catch(Exception e) {
			e.printStackTrace();
			//LogUtilityCommon.logError(e, e.getMessage());
			return null;
		}
		
	}
	public static String toYearString(Date date) {
		String dateStr = "";
		try {
			dateStr = new SimpleDateFormat("yyyy").format(date);
		} catch (Exception e) {
			//LogUtility.logError(e, e.getMessage(), DateUtil.class, null);
		}
		return dateStr;
	}
	public static Date toDate(String dateStr, String format) {
		Date date = null;
		try {
			DateFormat dateFormat = new SimpleDateFormat(format);
			date = (Date) dateFormat.parse(dateStr);
		} catch (Exception e) {
			e.printStackTrace();
			//LogUtilityCommon.logError(e, e.getMessage());
		}
		return date;
	}
	public static String toDateString(Date date, String format) {
		String dateString = "";
		if (date == null)
			return dateString;
		Object[] params = new Object[] { date };

		try {
			dateString = MessageFormat
					.format("{0,date," + format + "}", params);
		} catch (Exception e) {
			throw e;
		}
		return dateString;
	}

	public static int getMonth(Date date) {
		String month = null;
		DateFormat f = new SimpleDateFormat("MM");
		try {
			month = f.format(date);
			return Integer.parseInt(month);
		} catch (Exception e) {
			//LogUtility.logError(e, e.getMessage(), DateUtil.class, null);
			return -1;
		}
	}
	
	public String getParamId() {
		return paramId;
	}

	public void setParamId(String paramId) {
		this.paramId = paramId;
	}

	public String getParamName() {
		
		return paramName;
	}

	public String getParamNameNative() {
		
		return StringEscapeUtils.escapeJava(paramName);
	}
	
	public void setParamName(String paramName) {
		this.paramName = paramName;
	}

	public String getMaxId() {
		return maxId;
	}

	public void setMaxId(String maxId) {
		this.maxId = maxId;
	}

	public String getMaxValue() {
		return maxValue;
	}

	public void setMaxValue(String maxValue) {
		this.maxValue = maxValue;
	}

	public Integer getIsRequire() {
		return isRequire;
	}

	public void setIsRequire(Integer isRequire) {
		this.isRequire = isRequire;
	}

	
	
	

	public Integer getValueType() {
		return valueType;
	}

	public void setValueType(Integer valueType) {
		this.valueType = valueType;
	}

	public String getDataSrc() {
		return dataSrc;
	}

	public void setDataSrc(String dataSrc) {
		this.dataSrc = dataSrc;
	}


	
//	public List<ApParam> getLstDataSrc() {
//		return lstDataSrc;
//	}

//	public void setLstDataSrc(List<ApParam> lstDataSrc) {
//		this.lstDataSrc = lstDataSrc;
//	}

	
	
	
	public String getParamValue() {
		return paramValue;
	}

	public void setParamValue(String paramValue) {
		this.paramValue = paramValue;
	}
	
	
	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public String getMinValue() {
		return minValue;
	}

	public void setMinValue(String minValue) {
		this.minValue = minValue;
	}

	@Override
	public String toString() {
		return "ParamConstraint [paramId=" + paramId + ", paramName=" + paramName + ", maxId=" + maxId + ", maxValue="
				+ maxValue + ", minValue=" + minValue + ", isRequire=" + isRequire + ", valueType=" + valueType
				+ ", dataSrc=" + dataSrc +  ", paramValue=" + paramValue
				+ ", defaultValue=" + defaultValue + "]";
	}

	
	
	

	

	

	
		
}
