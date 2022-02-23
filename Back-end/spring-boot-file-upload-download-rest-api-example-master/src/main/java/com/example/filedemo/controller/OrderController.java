package com.example.filedemo.controller;


import com.example.filedemo.dto.dtoUserProduct;
import com.example.filedemo.entites.*;
import com.example.filedemo.repository.OrderRepository;
import com.example.filedemo.repository.ProductRepository;
import com.example.filedemo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@RestController
@RequestMapping("/api/order")
public class OrderController extends BaseResource<Order>{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private ProductRepository productRepository;



    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderAll(@PathVariable("id") int id)
    {
        Order orderCheck = new Order();
        orderCheck =  orderRepository.findById(id);


        if(orderCheck == null){
            return responseError("don hang khong ton ta", HttpStatus.BAD_REQUEST);
        }else{
            return responseSuccess(orderCheck,"search thanh cong");
        }

    }

}
