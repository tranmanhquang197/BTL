package com.example.filedemo.repository;

import com.example.filedemo.entites.Order;
import com.example.filedemo.entites.Role;
import org.springframework.data.jpa.repository.JpaRepository;



public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByName(String name);

}