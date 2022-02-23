package com.example.filedemo.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class dtoProductTypeNew {
    private int id;
    private String name;
    private int status;
    private String image;
    private String create_date;
}
