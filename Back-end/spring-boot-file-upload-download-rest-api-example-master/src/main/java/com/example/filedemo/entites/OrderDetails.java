package com.example.filedemo.entites;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;

@Table
@Entity
public class OrderDetails {

    @Id
    @GeneratedValue
    private Integer id;

    @Column
    private int productId;

    @Column
    private String productName;

    @Column
    private String image;

    @Column
    private int count;

    @Column
    private int price;

    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date createDate;

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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
}
