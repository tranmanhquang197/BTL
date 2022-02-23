package com.tsolution.excetions;

public class BusinessException extends Exception {

	/**
	 *
	 */
	private static final long serialVersionUID = 5071607540508825515L;

	public static final String COMMON_ERROR = "common.error";
	public static final String COMMON_INPUT_INFO_INVALID = "common.input.info.invalid";
	public static final String COMMON_NOT_SUPPORT = "common.not.support";
	public static final String COMMON_ACCESS_DENIED = "common.access.denied";
	public static final String COMMON_NO_CONTENT = "common.no.content";

	public BusinessException(String message) {
		super(message);
	}
}
