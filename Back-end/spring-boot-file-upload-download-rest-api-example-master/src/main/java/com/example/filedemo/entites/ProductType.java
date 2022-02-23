package com.example.filedemo.entites;


import com.example.filedemo.dto.dtoProductNew;
import com.example.filedemo.dto.dtoProductTypeNew;
import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;



@SqlResultSetMapping(
        name = "ProductTypeMapping",
        classes = {
                @ConstructorResult(targetClass = dtoProductTypeNew.class,
                        columns = {
                                @ColumnResult(name = "id", type = int.class),
                                @ColumnResult(name = "name", type = String.class),
                                @ColumnResult(name = "status", type = int.class),
                                @ColumnResult(name = "image", type = String.class),
                                @ColumnResult(name = "create_date", type = String.class)
                        }
                ),
        }
)

@Entity
@Table
public class ProductType {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column
    private String name;

    @Column
    private int status;

    @Column
    private String image;

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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}
