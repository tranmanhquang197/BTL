package com.example.filedemo.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

public class BaseResponse<T> {
	
	@JsonInclude(Include.NON_NULL)
	private String message;

	@JsonFormat(shape = JsonFormat.Shape.NUMBER)
	private Date timestamp = new Date();

	@JsonInclude(Include.NON_NULL)
	private T data;
	
	@JsonInclude(Include.NON_NULL)
	private Integer totalItemOfData;
	
	/**
	 * Default constructor
	 */
	public BaseResponse() {
    }
	
	public static <T> BaseResponse<T> success(T responseObject) {
		return success(responseObject, null);
	}
	
	public static <T> BaseResponse<T> success(String message) {
		return success(null, message);
	}
	
	public static <T> BaseResponse<T> success(T responseObject, String message) {
		BaseResponse<T> res = new BaseResponse<>();	
		res.setMessage(message);
		res.setData(responseObject);
		
		if (responseObject != null) {
			if (responseObject instanceof List) {
				res.setTotalItemOfData(((List<?>) responseObject).size());
			} else if (responseObject instanceof Map) {
				res.setTotalItemOfData(((Map<?, ?>) responseObject).size());
			} else {
				res.setTotalItemOfData(1);
			}
		}
		
		return res;
	}
	
	public static <T> BaseResponse<T> error(String message) {		
		BaseResponse<T> res = new BaseResponse<>();
		res.setMessage(message);
		
		return res;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public Integer getTotalItemOfData() {
		return totalItemOfData;
	}

	public void setTotalItemOfData(Integer totalItemOfData) {
		this.totalItemOfData = totalItemOfData;
	}
}