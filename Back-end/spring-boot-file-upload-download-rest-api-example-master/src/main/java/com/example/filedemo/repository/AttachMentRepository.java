package com.example.filedemo.repository;

import com.example.filedemo.entites.AttachMent;
import com.example.filedemo.entites.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachMentRepository extends JpaRepository<AttachMent, Long> {
}
