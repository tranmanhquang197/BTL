package com.tsolution.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class SerializeDateHandler extends StdSerializer<LocalDateTime> {

	private static final long serialVersionUID = -601499764403006185L;
	private static final Logger logger = LogManager.getLogger(SerializeDateHandler.class);

	public SerializeDateHandler() {
		this(null);
	}

	public SerializeDateHandler(Class<LocalDateTime> t) {
		super(t);
	}

	@Override
	public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider arg2) {
		try {
			gen.writeString(value.format(DateTimeFormatter.ofPattern(Constants.DATE_PATTERN)));
		} catch (Exception e) {
			SerializeDateHandler.logger.error(e.getMessage(), e);
		}
	}
}