package com.tsolution.config;

import java.io.IOException;
import java.io.Serializable;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolationException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.validation.DataBinder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tsolution._3services.impl.TelegramService;
import com.tsolution.excetions.BusinessException;
import com.tsolution.utils.Constants;

@ControllerAdvice
public class ResponseEntityExceptionHandlerConfig extends ResponseEntityExceptionHandler {

	private static final Logger log = LogManager.getLogger(ResponseEntityExceptionHandlerConfig.class);

	@Autowired
	private TelegramService telegramService;

	public static class CustomerResponseEntityException extends Exception implements Serializable {
		private static final long serialVersionUID = -8812950843507856768L;
		@JsonFormat(pattern = Constants.DATE_PATTERN, shape = JsonFormat.Shape.STRING)
		private final LocalDateTime timestamp;
		private final int status;
		private final String error;
		private final String message;
		private final String path;

		public CustomerResponseEntityException(LocalDateTime timestamp, int status, String error, String message,
				String path) {
			super();
			this.timestamp = timestamp;
			this.status = status;
			this.error = error;
			this.message = message;
			this.path = path;
		}

		public LocalDateTime getTimestamp() {
			return this.timestamp;
		}

		public int getStatus() {
			return this.status;
		}

		public String getError() {
			return this.error;
		}

		@Override
		public String getMessage() {
			return this.message;
		}

		public String getPath() {
			return this.path;
		}

	}

	@InitBinder
	private void activateDirectFieldAccess(DataBinder dataBinder) {
		dataBinder.initDirectFieldAccess();
	}

	@ExceptionHandler(BusinessException.class)
	protected ResponseEntity<Object> handleBusinessException(BusinessException ex) {
		ResponseEntityExceptionHandlerConfig.log.error(ex.getMessage(), ex);
		StringBuilder sb = new StringBuilder();
		for (StackTraceElement stackTraceElement : ex.getStackTrace()) {
			sb.append(stackTraceElement.toString());
		}
		this.telegramService.sendMessage(ex.getMessage());
		return new ResponseEntity<>(
				new CustomerResponseEntityException(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
						HttpStatus.INTERNAL_SERVER_ERROR.toString(), ex.getMessage(), null),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	protected ResponseEntity<Object> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
		ResponseEntityExceptionHandlerConfig.log.error(ex.getMessage(), ex);
		StringBuilder sb = new StringBuilder();
		for (StackTraceElement stackTraceElement : ex.getStackTrace()) {
			sb.append(stackTraceElement.toString());
		}
		this.telegramService.sendMessage(ex.getMessage());
		return new ResponseEntity<>(
				new CustomerResponseEntityException(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
						HttpStatus.INTERNAL_SERVER_ERROR.toString(), ex.getMessage(), null),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@Override
	protected ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers,
			HttpStatus status, WebRequest request) {
		ResponseEntityExceptionHandlerConfig.log.error(ex.getMessage(), ex);
		URI uri = headers.getLocation();
		String path = uri == null ? "" : uri.getPath();
		this.telegramService.sendMessage(ex.getMessage());
		return new ResponseEntity<>(new CustomerResponseEntityException(LocalDateTime.now(), status.value(),
				status.toString(), ex.getMessage(), path), status);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public void constraintViolationException(HttpServletResponse response) {
		try {
			response.sendError(HttpStatus.BAD_REQUEST.value());
		} catch (IOException e) {
			ResponseEntityExceptionHandlerConfig.log.error(e.getMessage(), e);
		}
	}

	@ExceptionHandler({ MethodArgumentTypeMismatchException.class })
	public ResponseEntity<Object> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex,
			WebRequest request) {
		ResponseEntityExceptionHandlerConfig.log.error(ex.getMessage(), ex);
		Class<?> clazz = ex.getRequiredType();
		String name = clazz == null ? "" : clazz.getName();
		String errors = String.format("%s  should be of type %s", ex.getName(), name);
		this.telegramService.sendMessage(errors);
		return new ResponseEntity<>(new CustomerResponseEntityException(LocalDateTime.now(),
				HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST.toString(), errors, null),
				HttpStatus.BAD_REQUEST);
	}

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		ResponseEntityExceptionHandlerConfig.log.error(ex.getMessage(), ex);
		String errors = ex.getBindingResult().getFieldErrors().parallelStream().map(FieldError::getDefaultMessage)
				.collect(Collectors.joining("\n\r"));
		URI uri = headers.getLocation();
		String path = uri == null ? "" : uri.getPath();
		this.telegramService.sendMessage(errors);
		return new ResponseEntity<>(new CustomerResponseEntityException(LocalDateTime.now(), status.value(),
				status.toString(), errors, path), status);
	}

	@Override
	protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		ResponseEntityExceptionHandlerConfig.log.error(ex.getMessage(), ex);
		String errors = ex.getParameterName() + " parameter is missing";
		URI uri = headers.getLocation();
		String path = uri == null ? "" : uri.getPath();
		this.telegramService.sendMessage(errors);
		return new ResponseEntity<>(new CustomerResponseEntityException(LocalDateTime.now(), status.value(),
				status.toString(), errors, path), status);
	}

	@Override
	protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		ResponseEntityExceptionHandlerConfig.log.error(ex.getMessage(), ex);
		URI uri = headers.getLocation();
		String path = uri == null ? "" : uri.getPath();
		return new ResponseEntity<>(new CustomerResponseEntityException(LocalDateTime.now(), status.value(),
				status.toString(), ex.getMessage(), path), status);
	}

	@Override
	protected ResponseEntity<Object> handleHttpMessageNotWritable(HttpMessageNotWritableException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		ResponseEntityExceptionHandlerConfig.log.error(ex.getMessage(), ex);
		URI uri = headers.getLocation();
		String path = uri == null ? "" : uri.getPath();
		this.telegramService.sendMessage(ex.getMessage());
		return new ResponseEntity<>(new CustomerResponseEntityException(LocalDateTime.now(), status.value(),
				status.toString(), ex.getMessage(), headers.getLocation() == null ? null : path), status);
	}

	@ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
	public ResponseEntity<Object> handleAuthenticationCredentialsNotFoundException(
			AuthenticationCredentialsNotFoundException e) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("UNAUTHORIZED");
	}
}
