package com.tsolution.config;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import com.tsolution.utils.DatetimeUtils;

@Converter(autoApply = true)
public class LocalDateTimeConverter implements AttributeConverter<LocalDateTime, Date> {

	@Override
	public Date convertToDatabaseColumn(LocalDateTime localDateTime) {
		return DatetimeUtils.localDateTime2UtilDate(localDateTime);
	}

	@Override
	public LocalDateTime convertToEntityAttribute(Date sqlDate) {
		if (sqlDate == null) {
			return null;
		}
		Date date = new Date(sqlDate.getTime());
		return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
	}

}