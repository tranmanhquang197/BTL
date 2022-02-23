package com.tsolution._2repositories;

import java.util.List;
import java.util.Map;

public class StatisticHelper {
	private StatisticHelper() {
	}

	public static String appendSelectColumn(boolean isFilter, String alias, String property,
			List<String> groupByColumns) {
		if (isFilter) {
			String column = alias + "." + property;
			groupByColumns.add(column);
			return String.format(" %s, ", column);
		} else {
			return String.format(" '' %s, ", property);
		}
	}

	public static String appendSelectColumn(boolean isFilter, String alias, String property, String asName,
			List<String> groupByColumns) {
		if (isFilter) {
			String column = alias + "." + property;
			groupByColumns.add(column);
			return String.format(" %s AS %s, ", column, asName);
		} else {
			return String.format(" null %s, ", asName);
		}
	}

	public static String appendWhereColumn(boolean isFilter, String alias, String property, Map<String, Object> params,
			Object paramValue) {
		if (isFilter) {
			String column = alias + "." + property;
			params.put(property, paramValue);
			return String.format(" AND %s IN (:%s) ", column, property);
		} else {
			return "";
		}
	}
}
