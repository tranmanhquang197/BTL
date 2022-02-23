package com.example.filedemo.dto;

import com.example.filedemo.entites.ProductType;

public class dtoProduct {
    private Integer id;
    private String name;
    private String productTypes;
    private int productPrice;
    private String description;
    private String image;
//    private int active;
//    private int main;

    public dtoProduct(Integer id, String name ,String productTypes, int productPrice, String description, String image) {
        this.name = name;
        this.id = id;
        this.productTypes = productTypes;
        this.productPrice = productPrice;
        this.description = description;
        this.image = image;

    }

    public dtoProduct() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getProductTypes() {
        return productTypes;
    }

    public void setProductTypes(String productTypes) {
        this.productTypes = productTypes;
    }

    public int getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(int productPrice) {
        this.productPrice = productPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

//    public int getActive() {
//        return active;
//    }
//
//    public void setActive(int active) {
//        this.active = active;
//    }
//
//    public int getMain() {
//        return main;
//    }
//
//    public void setMain(int main) {
//        this.main = main;
//    }
}
