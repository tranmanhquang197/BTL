package com.tsolution.utils;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class DeserializeDateHandler extends StdDeserializer<LocalDateTime> {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LogManager.getLogger(DeserializeDateHandler.class);

	public DeserializeDateHandler() {
		this(null);
	}

	public DeserializeDateHandler(Class<Object> clazz) {
		super(clazz);
	}

	@Override
	public LocalDateTime deserialize(JsonParser jsonparser, DeserializationContext context) {
		try {
			String date = jsonparser.getText();
			SimpleDateFormat sdf = new SimpleDateFormat(Constants.DATE_PATTERN);
			return sdf.parse(date).toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
		} catch (Exception e) {
			DeserializeDateHandler.logger.error(e.getMessage(), e);
			return null;
		}
	}
}