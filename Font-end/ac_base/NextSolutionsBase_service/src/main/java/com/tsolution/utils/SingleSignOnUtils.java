package com.tsolution.utils;

import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.tsolution.excetions.BusinessException;

@Component
public class SingleSignOnUtils {

	@Value("${single.sign.on.url}")
	private String singleSignOnUrl;

	private RestTemplate restTemplate;

	private static Logger log = LogManager.getLogger(SingleSignOnUtils.class);

	private SingleSignOnUtils() {
		this.restTemplate = new RestTemplate();
	}

	private <T> HttpEntity<T> getHttpEntity(String authorization, String acceptLanguage, T obj) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", authorization);
		headers.add("Accept-Language", acceptLanguage);
		return new HttpEntity<>(obj, headers);
	}

	public <T> ResponseEntity<Object> post(String authorization, String acceptLanguage, String urlRequest, T obj)
			throws BusinessException {
		ResponseEntity<Object> result = new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
		try {
			result = this.restTemplate.exchange(this.singleSignOnUrl + urlRequest, HttpMethod.POST,
					this.getHttpEntity(authorization, acceptLanguage, obj), Object.class);
		} catch (HttpStatusCodeException e) {
			String message = StringUtils.getExceptionMessage(e);
			SingleSignOnUtils.log.error(message, e);
			throw new BusinessException(message);
		}
		return result;
	}

	public <T> ResponseEntity<Object> patch(String authorization, String acceptLanguage, String urlRequest,
			Map<String, Long> pathVariables, T obj) throws BusinessException {
		ResponseEntity<Object> result = new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
		try {
			result = this.restTemplate.exchange(this.singleSignOnUrl + urlRequest + "?_method=patch", HttpMethod.POST,
					this.getHttpEntity(authorization, acceptLanguage, obj), Object.class, pathVariables);
		} catch (HttpStatusCodeException e) {
			String message = StringUtils.getExceptionMessage(e);
			SingleSignOnUtils.log.error(message, e);
			throw new BusinessException(message);
		}
		return result;
	}

	public ResponseEntity<Object> get(String authorization, String acceptLanguage, String urlRequest)
			throws BusinessException {
		ResponseEntity<Object> result = new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
		try {
			result = this.restTemplate.exchange(this.singleSignOnUrl + urlRequest, HttpMethod.GET,
					this.getHttpEntity(authorization, acceptLanguage, null), Object.class);
		} catch (HttpStatusCodeException e) {
			String message = StringUtils.getExceptionMessage(e);
			SingleSignOnUtils.log.error(message, e);
			throw new BusinessException(message);
		}
		return result;
	}
}
