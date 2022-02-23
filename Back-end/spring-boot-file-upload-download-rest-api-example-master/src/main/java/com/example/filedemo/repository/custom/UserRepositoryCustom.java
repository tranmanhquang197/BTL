package com.example.filedemo.repository.custom;


import com.example.filedemo.dto.dtoOrderDetail;
import com.example.filedemo.dto.dtoProductNew;
import com.example.filedemo.entites.Order;
import com.example.filedemo.entites.Product;
import com.example.filedemo.entites.ProductType;
import com.example.filedemo.entites.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepositoryCustom {
    List<User> findByIdTest();

    Page<Product> findProduct(String name, Integer productType, String fromDate, String toDate, Integer pageNumber, Integer pageSize, Pageable pageable);

    Page<User> findUser(String name, String phone, Integer status, Integer roles, Integer pageNumber, Integer pageSize, Pageable pageable);

    Page<ProductType> findProductType(String name, Integer status, String fromDate, String toDate, Integer pageNumber, Integer pageSize, Pageable pageable);

    Page<Order> findOrder(String name, Integer status, String fromDate, String toDate, Integer pageNumber, Integer pageSize, Pageable pageable);
}
