package com.example.filedemo.controller;

import java.util.List;

import com.example.filedemo.dto.*;
import com.example.filedemo.entites.Order;
import com.example.filedemo.entites.Product;
import com.example.filedemo.entites.ProductType;
import com.example.filedemo.entites.User;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class BaseResource<T> {
	
	protected ResponseEntity<?> responseListData(List<T> dataList) {
		if (CollectionUtils.isEmpty(dataList)) {
			return new ResponseEntity<>(BaseResponse.success(null), HttpStatus.NO_CONTENT);
		}
		
		return new ResponseEntity<>(BaseResponse.success(dataList), HttpStatus.OK);
	}
	
	protected ResponseEntity<?> responseNoContent() {
		return new ResponseEntity<>(BaseResponse.success(null), HttpStatus.NO_CONTENT);
	}
	
	protected ResponseEntity<?> responseSuccess(T responseObject, String message) {
		return new ResponseEntity<>(BaseResponse.success(responseObject, message), HttpStatus.OK);
	}
	protected ResponseEntity<?> responseSuccessProductType(ProductType productType, String message) {
		return new ResponseEntity<>(BaseResponse.success(productType, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccessProduct(Product product, String message) {
		return new ResponseEntity<>(BaseResponse.success(product, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccessOrder(Order order, String message) {
		return new ResponseEntity<>(BaseResponse.success(order, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccessProductTypeList(List<ProductType> productType, String message) {
		return new ResponseEntity<>(BaseResponse.success(productType, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccessLisOrder(List<Order> listorder, String message) {
		return new ResponseEntity<>(BaseResponse.success(listorder, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccessUserProduct(List<dtoUserProduct> listorder, String message) {
		return new ResponseEntity<>(BaseResponse.success(listorder, message), HttpStatus.OK);
	}


	protected ResponseEntity<?> responseSuccess(dtoProduct dtoProduct, String message) {
		return new ResponseEntity<>(BaseResponse.success(dtoProduct, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccessList(List<responseUser> list, String message) {
		return new ResponseEntity<>(BaseResponse.success(list, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccessListUser(List<User> list, String message) {
		return new ResponseEntity<>(BaseResponse.success(list, message), HttpStatus.OK);
	}

//	protected ResponseEntity<?> responseSuccessListDtoUser(List<dtoTest> list, String message) {
//		return new ResponseEntity<>(basePagae.success(list, message), HttpStatus.OK);
//	}


	protected ResponseEntity<?> responseSuccessOrder(List<Order> list, String message) {
		return new ResponseEntity<>(BaseResponse.success(list, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccessProduct(List<Product> list, String message) {
		return new ResponseEntity<>(BaseResponse.success(list, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccessUser(User user, String message) {
		return new ResponseEntity<>(BaseResponse.success(user, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccessProducts(List<responseProduct> list, String message) {
		return new ResponseEntity<>(BaseResponse.success(list, message), HttpStatus.OK);
	}
	protected ResponseEntity<?> responseSuccessreponseProduct(List<responseProduct> list, String message) {
		return new ResponseEntity<>(BaseResponse.success(list, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccess(responseUser responseUser, String message) {
		return new ResponseEntity<>(BaseResponse.success(responseUser, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccess(List<responseUser> responseUser, String message) {
		return new ResponseEntity<>(BaseResponse.success(responseUser, message), HttpStatus.OK);
	}

	protected ResponseEntity<?> responseSuccess( String message) {
		return new ResponseEntity<>(BaseResponse.success( message), HttpStatus.OK);
	}
	
	protected ResponseEntity<?> responseError(String message, HttpStatus status) {
		return new ResponseEntity<>(BaseResponse.error(message), status);
	}
}