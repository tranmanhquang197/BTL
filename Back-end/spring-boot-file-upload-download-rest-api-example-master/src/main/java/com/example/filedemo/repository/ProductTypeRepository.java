package com.example.filedemo.repository;

import com.example.filedemo.entites.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductTypeRepository extends JpaRepository<ProductType,Long> {
    ProductType findByName(String name);
    ProductType findById(int id);
}
