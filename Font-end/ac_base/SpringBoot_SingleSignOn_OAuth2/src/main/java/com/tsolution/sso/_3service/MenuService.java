package com.tsolution.sso._3service;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.tsolution.sso._1entities.Menu;
import com.tsolution.sso.exceptions.BusinessException;

import java.util.List;

public interface MenuService {
	ResponseEntity<Object> getOne(Long menuId);

	ResponseEntity<Object> find(Menu menu, Pageable pageable) throws BusinessException;

	ResponseEntity<Object> create(Menu menu) throws BusinessException;

	ResponseEntity<Object> update(Long id, Menu userEntityInput) throws BusinessException;

	ResponseEntity<Object> delete(Long id) throws BusinessException;

	ResponseEntity<Object> deleteWithReference(Long id) throws BusinessException;

	ResponseEntity<Object> getAll();

	ResponseEntity<Object> findByClientId(String clientId);

    ResponseEntity<Object> createList(List<Menu> menuList) throws BusinessException;
}
