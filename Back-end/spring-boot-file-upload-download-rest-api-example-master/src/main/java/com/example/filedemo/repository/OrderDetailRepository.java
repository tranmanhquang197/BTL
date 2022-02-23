package com.example.filedemo.repository;

import com.example.filedemo.entites.AttachMent;
import com.example.filedemo.entites.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailRepository extends JpaRepository<OrderDetails, Long> {
}
