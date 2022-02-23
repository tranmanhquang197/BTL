package com.example.filedemo.dto;

import com.example.filedemo.entites.AttachMent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class dtoProductNew {
    private int id;
    private String name;
    private int product_types;
    private int status;
    private int count;
    private int rest;
    private int price;
    private int sale;
    private String url;
    private String create_date;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserName() {
        return name;
    }

    public void setUserName(String name) {
        this.name = name;
    }

//    public int getProductTypes() {
//        return productTypes;
//    }
//
//    public void setProductTypes(int productTypes) {
//        this.productTypes = productTypes;
//    }
//
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getRest() {
        return rest;
    }

    public void setRest(int rest) {
        this.rest = rest;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getSale() {
        return sale;
    }

    public void setSale(int sale) {
        this.sale = sale;
    }

    public int getProduct_types() {
        return product_types;
    }

    public void setProduct_types(int product_types) {
        this.product_types = product_types;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}

