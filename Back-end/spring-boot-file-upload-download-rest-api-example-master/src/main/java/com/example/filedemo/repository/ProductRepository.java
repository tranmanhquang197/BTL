package com.example.filedemo.repository;
import com.example.filedemo.dto.dtoProductNew;
import com.example.filedemo.dto.responseProduct;
import com.example.filedemo.entites.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long> {
    Product findByName(String name);
    Product findById(int id);
    List<Product> findAll();


    @Query(
            value = " select * from cvserver.product p" +
                    " where p.name = :name "
                    ,
            nativeQuery = true)
    Page<Product> findAllProduct(@Param("name") String name,
                                 Pageable pageable);
}
