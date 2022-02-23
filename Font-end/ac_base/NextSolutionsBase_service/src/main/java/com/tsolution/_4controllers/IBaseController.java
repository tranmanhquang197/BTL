package com.tsolution._4controllers;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.tsolution.excetions.BusinessException;

public interface IBaseController<T extends Serializable> {
	ResponseEntity<Object> findById(@PathVariable("id") Long id) throws BusinessException;

	ResponseEntity<Object> create(@RequestBody List<T> entity) throws BusinessException;

	ResponseEntity<Object> update(@PathVariable("id") Long id, @RequestBody Optional<T> source)
			throws BusinessException;
}
