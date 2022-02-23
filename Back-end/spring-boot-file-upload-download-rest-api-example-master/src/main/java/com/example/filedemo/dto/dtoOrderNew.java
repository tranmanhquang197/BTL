package com.example.filedemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class dtoOrderNew {
    private int id;
    private String image;
    private String name;
    private String orderName;
    private int price;
    private int status;
    private String create_date;

}
