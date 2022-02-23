package com.example.filedemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class dtoUserNew {

    private int id;
    private String username;
    private String phone;
    private String image;
    private Integer status;
    private String create_date;
    private String roles;

}
