package com.tsolution.utils;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.DefaultOAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestOperations;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.token.AccessTokenRequest;
import org.springframework.security.oauth2.client.token.DefaultAccessTokenRequest;
import org.springframework.security.oauth2.client.token.grant.password.ResourceOwnerPasswordResourceDetails;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsolution._1entities.dto.RestPageImpl;
import com.tsolution.excetions.BusinessException;
import com.tsolution.excetions.UntranslatedException;

public class CallApiUtils {
	private static Logger logger = LogManager.getLogger(CallApiUtils.class);

	private CallApiUtils() {
	}

	private static RestTemplate restTemplate = new RestTemplate();

	private static <T> HttpEntity<T> getHttpEntity(String accessToken, T obj) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "BEARER " + accessToken);
		headers.add("Accept-Language", LocaleContextHolder.getLocale().getLanguage());
		return new HttpEntity<>(obj, headers);
	}

	public static OAuth2RestOperations login(String accessTokenUri, String clientId, String clientSecret,
			String username, String password) {
		OAuth2RestOperations oAuth2RestOperations = null;
		try {
			ResourceOwnerPasswordResourceDetails resource = new ResourceOwnerPasswordResourceDetails();
			resource.setAccessTokenUri(accessTokenUri);
			resource.setClientId(clientId);
			resource.setClientSecret(clientSecret);
			resource.setGrantType("password");
			resource.setUsername(username);
			resource.setPassword(password);
			AccessTokenRequest atr = new DefaultAccessTokenRequest();
			oAuth2RestOperations = new OAuth2RestTemplate(resource, new DefaultOAuth2ClientContext(atr));
		} catch (Exception e) {
			CallApiUtils.logger.error(e.getMessage(), e);
		}
		return oAuth2RestOperations;
	}

	public static <T> ResponseEntity<Object> post(String host, OAuth2AccessToken oAuth2AccessToken, String urlRequest,
			T obj) {
		try {
			return CallApiUtils.restTemplate.exchange(host + urlRequest, HttpMethod.POST,
					CallApiUtils.getHttpEntity(oAuth2AccessToken.getValue(), obj), Object.class);
		} catch (RestClientException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	public static <T> ResponseEntity<T> post(String host, String accessToken, String urlRequest, Object body,
			Class<T> responseClass) {
		try {
			return CallApiUtils.restTemplate.exchange(host + urlRequest, HttpMethod.POST,
					CallApiUtils.getHttpEntity(accessToken, body), responseClass);
		} catch (RestClientException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	public static <T> ResponseEntity<T> get(String host, String accessToken, String urlRequest, Class<T> clazz) {
		try {
			return CallApiUtils.restTemplate.exchange(host + urlRequest, HttpMethod.GET,
					CallApiUtils.getHttpEntity(accessToken, null), clazz);
		} catch (RestClientException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	public static <T> RestPageImpl<T> getPage(String host, String accessToken, String urlRequest, Class<T> clazz)
			throws UntranslatedException {
		return CallApiUtils.getPage(HttpMethod.GET, host, accessToken, urlRequest, null, clazz);
	}

	public static <T> RestPageImpl<T> postPage(String host, String accessToken, String urlRequest, Object body,
			Class<T> clazz) throws UntranslatedException {
		return CallApiUtils.getPage(HttpMethod.POST, host, accessToken, urlRequest, body, clazz);
	}

	private static <T> RestPageImpl<T> getPage(HttpMethod method, String host, String accessToken, String urlRequest,
			Object body, Class<T> clazz) throws UntranslatedException {
		ParameterizedTypeReference<RestPageImpl<T>> typeRef = new ParameterizedTypeReference<RestPageImpl<T>>() {
		};
		ResponseEntity<RestPageImpl<T>> responseEntity;
		try {
			responseEntity = CallApiUtils.restTemplate.exchange(host + urlRequest, method,
					CallApiUtils.getHttpEntity(accessToken, body), typeRef);
		} catch (RestClientException e) {
			responseEntity = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
		if (!HttpStatus.OK.equals(responseEntity.getStatusCode())) {
			throw new UntranslatedException(BusinessException.COMMON_ERROR);
		}
		RestPageImpl<T> pageT = responseEntity.getBody();
		if (pageT == null) {
			pageT = new RestPageImpl<>();
		}
		if (pageT.hasContent()) {
			try {
				ObjectMapper mapper = new ObjectMapper()
						.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
						.disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES);
				String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(pageT.getContent());
				JavaType type = mapper.getTypeFactory().constructCollectionType(List.class, clazz);
				List<T> ts = mapper.readValue(json, type);
				return new RestPageImpl<>(ts, pageT.getPageable(), pageT.getTotalElements());
			} catch (Exception e) {
				CallApiUtils.logger.error(e.getMessage(), e);
				throw new UntranslatedException(BusinessException.COMMON_ERROR);
			}
		}
		return pageT;
	}

	public static <T> List<T> getList(String host, String accessToken, String urlRequest, Class<T> clazz)
			throws UntranslatedException {
		ParameterizedTypeReference<List<T>> typeRef = new ParameterizedTypeReference<List<T>>() {
		};
		ResponseEntity<List<T>> responseEntity;
		try {
			responseEntity = CallApiUtils.restTemplate.exchange(host + urlRequest, HttpMethod.GET,
					CallApiUtils.getHttpEntity(accessToken, null), typeRef);
		} catch (RestClientException e) {
			responseEntity = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
		if (!HttpStatus.OK.equals(responseEntity.getStatusCode())) {
			throw new UntranslatedException(BusinessException.COMMON_ERROR);
		}
		List<T> listT = responseEntity.getBody();
		if (listT == null) {
			listT = new ArrayList<>();
		}
		if (!listT.isEmpty()) {
			try {
				ObjectMapper mapper = new ObjectMapper()
						.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
						.disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES);
				String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(listT);
				JavaType type = mapper.getTypeFactory().constructCollectionType(List.class, clazz);
				return mapper.readValue(json, type);
			} catch (Exception e) {
				CallApiUtils.logger.error(e.getMessage(), e);
				throw new UntranslatedException(BusinessException.COMMON_ERROR);
			}
		}
		return listT;
	}

	public static <T> List<T> postList(String host, String accessToken, String urlRequest, Object body, Class<T> clazz)
			throws UntranslatedException {
		ParameterizedTypeReference<List<T>> typeRef = new ParameterizedTypeReference<List<T>>() {
		};
		ResponseEntity<List<T>> responseEntity;
		try {
			responseEntity = CallApiUtils.restTemplate.exchange(host + urlRequest, HttpMethod.POST,
					CallApiUtils.getHttpEntity(accessToken, body), typeRef);
		} catch (RestClientException e) {
			responseEntity = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
		if (!HttpStatus.OK.equals(responseEntity.getStatusCode())) {
			throw new UntranslatedException(BusinessException.COMMON_ERROR);
		}
		List<T> listT = responseEntity.getBody();
		if (listT == null) {
			listT = new ArrayList<>();
		}
		if (!listT.isEmpty()) {
			try {
				ObjectMapper mapper = new ObjectMapper()
						.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
						.disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES);
				String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(listT);
				JavaType type = mapper.getTypeFactory().constructCollectionType(List.class, clazz);
				return mapper.readValue(json, type);
			} catch (Exception e) {
				CallApiUtils.logger.error(e.getMessage(), e);
				throw new UntranslatedException(BusinessException.COMMON_ERROR);
			}
		}
		return listT;
	}
}
