package com.tsolution._3services.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsolution._1entities.Generator;
import com.tsolution._1entities.oauth2.OAuth2AuthenticationDto;
import com.tsolution._2repositories.GeneratorRepository;
import com.tsolution.config.AuthenticationFacade;
import com.tsolution.excetions.BusinessException;
import com.tsolution.utils.Translator;

public abstract class BaseService {

	private static final Logger log = LogManager.getLogger(BaseService.class);

	@Autowired
	protected AuthenticationFacade authenticationFacade;

	@Autowired
	protected Translator translator;

	@Autowired
	private GeneratorRepository generatorRepository;

	@Bean
	protected LocalDateTime getSysdate() {
		return this.generatorRepository.getSysdate();
	}

	protected OAuth2AuthenticationDto getCurrentOAuth2Details() throws BusinessException {
		if (this.authenticationFacade.getAuthentication() instanceof OAuth2Authentication) {
			OAuth2Authentication auth2Authentication = (OAuth2Authentication) this.authenticationFacade
					.getAuthentication();
			Authentication authentication = auth2Authentication.getUserAuthentication();
			if (authentication.getDetails() instanceof Map<?, ?>) {
				ObjectMapper mapper = new ObjectMapper();
				Map<?, ?> map = (Map<?, ?>) authentication.getDetails();
				String json = null;
				try {
					json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(map);
					return mapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT).readValue(json,
							OAuth2AuthenticationDto.class);
				} catch (IOException e) {
					BaseService.log.error(e.getMessage(), e);
					throw new BusinessException("ERROR OAuth2AuthenticationDto mapper");
				}
			}
		}
		return null;
	}

	protected String getCurrentAccessToken() {
		if (this.authenticationFacade.getAuthentication() instanceof OAuth2Authentication) {
			OAuth2Authentication auth2Authentication = (OAuth2Authentication) this.authenticationFacade
					.getAuthentication();
			OAuth2AuthenticationDetails oAuth2AuthenticationDetails = (OAuth2AuthenticationDetails) auth2Authentication
					.getDetails();
			return oAuth2AuthenticationDetails.getTokenValue();
		}
		return null;
	}

	protected String getCurrentUsername() throws BusinessException {
		return this.getCurrentOAuth2Details().getUserAuthentication().getPrincipal().getUsername();
	}

	protected Boolean hasAuthority(List<String> authorities) throws BusinessException {
		OAuth2AuthenticationDto oAuth2AuthenticationDto = this.getCurrentOAuth2Details();
		if (oAuth2AuthenticationDto == null) {
			return false;
		}
		for (String authority : authorities) {
			if (oAuth2AuthenticationDto.getAuthorities().parallelStream()
					.noneMatch(auth -> auth.getAuthority().equalsIgnoreCase(authority))) {
				return false;
			}
		}
		return true;
	}

	protected void validFromDateToDate(LocalDateTime fromDate, LocalDateTime toDate, Boolean isAdd,
			Boolean isRequiredToDate, LocalDateTime sysdate) throws BusinessException {
		if (fromDate == null) {
			throw new BusinessException(this.translator.toLocale("common.input.missing.from.date"));
		}
		if (Boolean.TRUE.equals(isRequiredToDate) && (toDate == null)) {
			throw new BusinessException(this.translator.toLocale("common.input.missing.to.date"));
		}
		if (Boolean.TRUE.equals(isAdd) && fromDate.toLocalDate().isBefore(sysdate.toLocalDate())) {
			throw new BusinessException(this.translator.toLocale("common.input.from.date.can.not.less.than.sysdate"));
		}
		if ((toDate != null) && toDate.toLocalDate().isBefore(sysdate.toLocalDate())) {
			throw new BusinessException(this.translator.toLocale("common.input.to.date.can.not.less.than.sysdate"));
		}
		if ((toDate != null) && toDate.toLocalDate().isBefore(fromDate.toLocalDate())) {
			throw new BusinessException(
					this.translator.toLocale("common.input.to.date.must.be.greater.or.equal.from.date"));
		}

	}

	protected void validFromDateToDatePlusOne(LocalDateTime fromDate, LocalDateTime toDate, Boolean isAdd,
			Boolean isRequiredToDate, LocalDateTime sysdate) throws BusinessException {
		this.validFromDateToDate(fromDate, toDate, isAdd, isRequiredToDate, sysdate);
		if (Boolean.TRUE.equals(isAdd) && fromDate.toLocalDate().isEqual(sysdate.toLocalDate())) {
			throw new BusinessException(this.translator.toLocale("from.date.must.be.greater.than.today"));
		}
		if (Boolean.TRUE.equals(isAdd) && (toDate != null) && toDate.toLocalDate().isEqual(sysdate.toLocalDate())) {
			throw new BusinessException(this.translator.toLocale("to.date.must.be.greater.or.equal.today"));
		}
	}

	protected Boolean isInRange(LocalDateTime date, LocalDateTime fromDate, LocalDateTime toDate) {
		LocalDate xDate = date.toLocalDate();
		LocalDate xFromDate = fromDate.toLocalDate();
		LocalDate xToDate = toDate.toLocalDate();
		return !(xDate.isBefore(xFromDate) || xDate.isAfter(xToDate));
	}

	protected <T> List<T> getListValueFromResponse(Object obj, Class<T> clazz) {
		try {
			ObjectMapper mapper = new ObjectMapper().enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
					.disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES);
			String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
			JavaType type = null;
			if (obj instanceof List<?>) {
				type = mapper.getTypeFactory().constructCollectionType(List.class, clazz);
			}
			if (type == null) {
				T temp = mapper.readValue(json, clazz);
				return Collections.singletonList(temp);
			}
			return mapper.readValue(json, type);
		} catch (Exception e) {
			BaseService.log.error(e.getMessage(), e);
			return Collections.emptyList();
		}
	}

	protected <T> List<T> getListObject(String json, Class<T> clazz) {
		try {
			ObjectMapper mapper = new ObjectMapper().enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
					.disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES);
			JavaType type = mapper.getTypeFactory().constructCollectionType(List.class, clazz);
			return mapper.readValue(json, type);
		} catch (Exception e) {
			BaseService.log.error(e.getMessage(), e);
			return Collections.emptyList();
		}
	}

	protected <T> T getObject(String jSon, Class<T> clazz) {
		ObjectMapper objectMapper = new ObjectMapper().enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
				.disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES);
		try {
			return objectMapper.readValue(jSon, clazz);
		} catch (IOException e) {
			BaseService.log.error(e.getMessage(), e);
			return null;
		}
	}

	protected <T> T getObject(Map<?, ?> map, Class<T> clazz) {
		ObjectMapper objectMapper = new ObjectMapper().enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
				.disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES);
		try {
			String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(map);
			return objectMapper.readValue(json, clazz);
		} catch (IOException e) {
			BaseService.log.error(e.getMessage(), e);
			return null;
		}
	}

	protected String object2String(Object obj) {
		ObjectMapper objectMapper = new ObjectMapper().enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
				.disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES);
		try {
			return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
		} catch (JsonProcessingException e) {
			BaseService.log.error(e.getMessage(), e);
			return null;
		}
	}

	protected String getGeneratorValue(String code) {
		Long suffixNumber = null;
		Optional<Generator> oGenerator = this.generatorRepository.findOneByCode(code);
		if (oGenerator.isPresent()) {
			try {
				suffixNumber = Long.valueOf(oGenerator.get().getValue()) + 1;
			} catch (NumberFormatException e) {
				BaseService.log.error(e.getMessage(), e);
				return null;
			}
		} else {
			suffixNumber = 1L;
		}
		this.generatorRepository.save(new Generator(code, suffixNumber.toString()));
		return suffixNumber.toString();
	}

	protected <T> Predicate<T> distinctByKeys(List<Function<? super T, ?>> keyExtractors) {
		final Map<List<?>, Boolean> seen = new ConcurrentHashMap<>();
		return t -> {
			final List<?> keys = keyExtractors.parallelStream().map(ke -> ke.apply(t)).collect(Collectors.toList());
			return seen.putIfAbsent(keys, Boolean.TRUE) == null;
		};
	}

	protected <T> Map<Object, List<T>> groupListBy(List<T> data, List<Function<T, ?>> groupKeys) {
		return data.parallelStream().collect(Collectors
				.groupingBy(cl -> groupKeys.parallelStream().map(f -> f.apply(cl)).collect(Collectors.toList())));
	}

	protected <T> Map<T, Long> countGroupByKeys(List<T> data, List<Function<T, ?>> groupKeys,
			List<Function<? super T, ?>> distinctKeys) {
		Map<Object, List<T>> map = this.groupListBy(data, groupKeys);
		Map<T, Long> result = new HashMap<>();
		for (Entry<Object, List<T>> entry : map.entrySet()) {
			List<T> value = entry.getValue();
			if (!distinctKeys.isEmpty()) {
				value = value.parallelStream().filter(this.distinctByKeys(distinctKeys)).collect(Collectors.toList());
			}
			if (!value.isEmpty()) {
				result.put(value.get(0), (long) value.size());
			}
		}
		return result;
	}
}
