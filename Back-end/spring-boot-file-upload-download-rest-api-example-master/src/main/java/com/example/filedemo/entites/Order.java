package com.example.filedemo.entites;

import com.example.filedemo.dto.dtoOrderNew;
import com.example.filedemo.dto.dtoProductNew;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import  java.util.Date;
import java.util.List;

@SqlResultSetMapping(
        name = "OrderMapping",
        classes = {
                @ConstructorResult(targetClass = dtoOrderNew.class,
                        columns = {
                                @ColumnResult(name = "id", type = int.class),
                                @ColumnResult(name = "image", type = String.class),
                                @ColumnResult(name = "name", type = String.class),
                                @ColumnResult(name = "orderName", type = String.class),
                                @ColumnResult(name = "price", type = int.class),
                                @ColumnResult(name = "status", type = int.class),
                                @ColumnResult(name = "create_date", type = String.class)
                        }
                ),
        }
)

@Entity
@Table
public class Order {

    @Id
    @GeneratedValue
    private Integer id;

    @OneToMany(targetEntity = OrderDetails.class,cascade = CascadeType.ALL)
    @JoinColumn(name = "orderDetail_id",referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<OrderDetails> orderDetail;




    @Column
    private int userId;

    @Column
    private int totalPrice;

    @Column
    private int statusOrder;

    @Column
    private int paymentConfirmation;

    @Column
    private String address;

    @Column
    private String phone;

    @Column
    private String name;

    @Column
    private String email;

    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date orderDate;


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getPriceTotal() {
        return totalPrice;
    }

    public void setPriceTotal(int priceTotal) {
        this.totalPrice = priceTotal;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public List<OrderDetails> getOrderDetail() {
        return orderDetail;
    }

    public void setOrderDetail(List<OrderDetails> orderDetail) {
        this.orderDetail = orderDetail;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getStatusOrder() {
        return statusOrder;
    }

    public void setStatusOrder(int statusOrder) {
        this.statusOrder = statusOrder;
    }

    public int getPaymentConfirmation() {
        return paymentConfirmation;
    }

    public void setPaymentConfirmation(int paymentConfirmation) {
        this.paymentConfirmation = paymentConfirmation;
    }
}
