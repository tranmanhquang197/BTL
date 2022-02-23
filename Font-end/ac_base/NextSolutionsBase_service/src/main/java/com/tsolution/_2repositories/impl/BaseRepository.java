package com.tsolution._2repositories.impl;

import java.sql.Connection;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.internal.SessionImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsolution.excetions.BusinessException;
import com.tsolution.utils.Translator;

public class BaseRepository {
	private static final String COMMON_REPOSITORY_CONVERT_RESULT_FAIL = "common.repository.convert.result.fail";

	private static final Logger log = LogManager.getLogger(BaseRepository.class);

	@Autowired
	private static Translator translator;

	private BaseRepository() {
	}

	public static <T> List<T> getResultListNativeQuery(EntityManager em, String strQuery, Map<String, Object> params,
			Class<T> clazz) throws BusinessException {
		Query nativeQuery = em.createNativeQuery(strQuery, clazz);
		params.forEach(nativeQuery::setParameter);
		final List<T> resultList = new ArrayList<>();
		for (final Object obj : nativeQuery.getResultList()) {
			if (obj == null) {
				continue;
			}
			if (clazz.isInstance(obj)) {
				resultList.add(clazz.cast(obj));
			} else {
				throw new BusinessException(
						BaseRepository.translator.toLocale(BaseRepository.COMMON_REPOSITORY_CONVERT_RESULT_FAIL));
			}
		}
		return resultList;
	}

	public static <T> T getScalarResult(EntityManager em, String strQuery, Map<String, Object> params, Class<T> clazz) {
		Query nativeCountQuery = em.createNativeQuery(strQuery);
		params.forEach(nativeCountQuery::setParameter);
		try {
			Object obj = nativeCountQuery.getSingleResult();
			ObjectMapper mapper = new ObjectMapper();
			String debugResult = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
			BaseRepository.log.debug(debugResult);
			BaseRepository.log.debug(obj.getClass());
			if (clazz.isInstance(obj)) {
				return clazz.cast(obj);
			}
		} catch (NoResultException e) {
			BaseRepository.log.info(e.getMessage());
		} catch (Exception e) {
			BaseRepository.log.error(e.getMessage());
			if (BaseRepository.log.isDebugEnabled()) {
				BaseRepository.log.debug(e.getMessage(), e);
			}
		}
		return null;
	}

	public static <T> Page<T> getPagedNativeQuery(EntityManager em, String strQuery, String strCountQuery,
			Map<String, Object> params, Pageable pageable, Class<T> clazz) throws BusinessException {
		Query nativeQuery = em.createNativeQuery(strQuery, clazz);
		int firstResult = pageable.getPageNumber() * pageable.getPageSize();
		nativeQuery.setFirstResult(firstResult);
		nativeQuery.setMaxResults(pageable.getPageSize());
		params.forEach(nativeQuery::setParameter);
		final List<T> resultList = new ArrayList<>();
		for (final Object obj : nativeQuery.getResultList()) {
			if (clazz.isInstance(obj)) {
				resultList.add(clazz.cast(obj));
				continue;
			}
			throw new BusinessException(
					BaseRepository.translator.toLocale(BaseRepository.COMMON_REPOSITORY_CONVERT_RESULT_FAIL));
		}

		Number total = BaseRepository.getScalarResult(em, strCountQuery, params, Number.class);

		return new PageImpl<>(resultList, pageable, total == null ? resultList.size() : total.longValue());
	}

	public static <T> T getFirstResultNativeQuery(EntityManager em, String strQuery, Map<String, Object> params,
			Class<T> clazz) throws BusinessException {
		List<T> list = BaseRepository.getResultListNativeQuery(em, strQuery, params, clazz);
		if (list.isEmpty()) {
			return null;
		}
		return list.get(0);
	}

	public static <T> Optional<T> getFirstOptionalResultNativeQuery(EntityManager em, String strQuery,
			Map<String, Object> params, Class<T> clazz) throws BusinessException {
		T t = BaseRepository.getFirstResultNativeQuery(em, strQuery, params, clazz);
		if (t == null) {
			return Optional.empty();
		}
		return Optional.of(t);
	}

	public static int countRowEffects(EntityManager em, String strQuery, Map<String, Object> params)
			throws BusinessException {
		if (!em.isJoinedToTransaction()) {
			em.joinTransaction();
		}
		Query nativeQuery = em.createNativeQuery(strQuery);
		params.forEach(nativeQuery::setParameter);
		try {
			return nativeQuery.executeUpdate();
		} catch (Exception e) {
			BaseRepository.log.error("{}\n{}\n{}\n{}", e.getMessage(), strQuery, params, e);
			throw new BusinessException("countRowEffects ERROR");
		}
	}

	public static void executeDDLQuery(EntityManager em, String strQuery) throws BusinessException {
		if (!em.isJoinedToTransaction()) {
			em.joinTransaction();
		}
		Connection connection = em.unwrap(SessionImpl.class).connection();
		try (Statement statement = connection.createStatement()) {
			statement.executeUpdate(strQuery);
		} catch (Exception e) {
			BaseRepository.log.error("{}\n{}\n{}", e.getMessage(), strQuery, e);
			throw new BusinessException("executeQuery ERROR");
		}
	}
}
