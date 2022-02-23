package com.example.filedemo.dto;


import com.example.filedemo.entites.ProductType;

import java.util.List;

public class dtoHome {
    private List<dtoProduct> dtoProduct;

    private List<dtoProductType>  dtoProductType;

    public dtoHome(List<com.example.filedemo.dto.dtoProduct> dtoProduct, List<com.example.filedemo.dto.dtoProductType> dtoProductType) {
        this.dtoProduct = dtoProduct;
        this.dtoProductType = dtoProductType;
    }

    public List<com.example.filedemo.dto.dtoProduct> getDtoProduct() {
        return dtoProduct;
    }

    public void setDtoProduct(List<com.example.filedemo.dto.dtoProduct> dtoProduct) {
        this.dtoProduct = dtoProduct;
    }

    public List<com.example.filedemo.dto.dtoProductType> getDtoProductType() {
        return dtoProductType;
    }

    public void setDtoProductType(List<com.example.filedemo.dto.dtoProductType> dtoProductType) {
        this.dtoProductType = dtoProductType;
    }
}
