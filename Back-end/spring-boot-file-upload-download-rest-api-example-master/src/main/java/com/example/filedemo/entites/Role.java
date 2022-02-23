package com.example.filedemo.entites;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@Entity
@Table
public class Role {
    @Id
    @GeneratedValue
//    @Column(name = "role_id")
    private Integer id;

    @Column
    private String name;

    @Column
    private String descript;

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

    public String getDescript() {
        return descript;
    }

    public void setDescript(String descript) {
        this.descript = descript;
    }
}
