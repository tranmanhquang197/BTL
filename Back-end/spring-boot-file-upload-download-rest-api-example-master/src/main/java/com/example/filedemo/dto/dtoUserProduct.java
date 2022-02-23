package com.example.filedemo.dto;

import java.util.Date;

public class dtoUserProduct {

    private int id;
    private int productId ;
    private String productName;
    private String image;
    private int count;
    private int price;
    private int priceTotal;
    private Date orderDate;

    public dtoUserProduct(int id, int productId, Date orderDate, String productName, String image, int count, int price, int priceTotal) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.image = image;
        this.count = count;
        this.price = price;
        this.priceTotal = priceTotal;
        this.orderDate = orderDate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getPriceTotal() {
        return priceTotal;
    }

    public void setPriceTotal(int priceTotal) {
        this.priceTotal = priceTotal;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }
}
