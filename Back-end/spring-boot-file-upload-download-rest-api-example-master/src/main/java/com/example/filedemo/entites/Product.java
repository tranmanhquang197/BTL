package com.example.filedemo.entites;

import com.example.filedemo.dto.dtoProductNew;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.*;


@SqlResultSetMapping(
        name = "ProductMapping",
        classes = {
                @ConstructorResult(targetClass = dtoProductNew.class,
                        columns = {
                                @ColumnResult(name = "id", type = int.class),
                                @ColumnResult(name = "name", type = String.class),
                                @ColumnResult(name = "product_types", type = int.class),
                                @ColumnResult(name = "status", type = int.class),
                                @ColumnResult(name = "count", type = int.class),
                                @ColumnResult(name = "rest", type = int.class),
                                @ColumnResult(name = "price", type = int.class),
                                @ColumnResult(name = "sale", type = int.class),
                                @ColumnResult(name = "url", type = String.class),
                                @ColumnResult(name = "create_date", type = String.class)
                        }
                ),
        }
)

@Entity
@Table
public class Product {

    @Id
    @GeneratedValue
    private Integer id;

    @Column
    private String name;


    private int productTypes;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "m_product_attachment", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "attachment_id"))
    private Set<AttachMent> attachMents;


    @Column
    private String description;


    @Column
    private int status;

    @Column
    private int count;

    @Column
    private int rest;

    @Column
    private int price;

    @Column
    private int sale;


    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date createDate;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getProductTypes() {
        return productTypes;
    }

    public void setProductTypes(int productTypes) {
        this.productTypes = productTypes;
    }

    public Set<AttachMent> getAttachMents() {
        return attachMents;
    }

    public void setAttachMents(Set<AttachMent> attachMents) {
        this.attachMents = attachMents;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

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

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}
