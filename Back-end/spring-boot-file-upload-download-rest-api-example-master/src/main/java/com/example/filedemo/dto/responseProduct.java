package com.example.filedemo.dto;

import org.springframework.web.bind.annotation.RequestParam;

import javax.persistence.Column;
import java.util.ArrayList;
import java.util.List;

public class responseProduct {

    private int id ;
    private String name;
    private String description;
    private int price;
    private String image;
    private int count;
    private int sale;
    private String image1;
    private String image2;
    private String image3;
    private String screen;
    private String operatingSystem;
    private String frontCamera;
    private String rearCamera;
    private String cpu;
    private String ram;
    private String internalMemory;
    private String pin;
    private String memoryStick;
    private String sim;
    private String productType;
    public responseProduct() {
    }

    public responseProduct(int id, String name, String description, int price, String image,String productType,int count,int sale,String image1,String image2,String image3,String screen,String operatingSystem,String frontCamera,String rearCamera,String cpu,String ram,String internalMemory,String pin,String memoryStick, String sim) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.productType =productType;
        this.count = count;
        this.sale = sale;
        this.image1 = image1;
        this.image2 = image2;
        this.image3 = image3;
        this.screen = screen;
        this.operatingSystem = operatingSystem;
        this.frontCamera = frontCamera;
        this.rearCamera = rearCamera;
        this.cpu = cpu;
        this.ram = ram;
        this.internalMemory = internalMemory;
        this.pin =pin ;
        this.memoryStick = memoryStick;
        this.sim = sim;

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
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

    public int getSale() {
        return sale;
    }

    public void setSale(int sale) {
        this.sale = sale;
    }

    public String getImage1() {
        return image1;
    }

    public void setImage1(String image1) {
        this.image1 = image1;
    }

    public String getImage2() {
        return image2;
    }

    public void setImage2(String image2) {
        this.image2 = image2;
    }

    public String getImage3() {
        return image3;
    }

    public void setImage3(String image3) {
        this.image3 = image3;
    }

    public String getScreen() {
        return screen;
    }

    public void setScreen(String screen) {
        this.screen = screen;
    }

    public String getOperatingSystem() {
        return operatingSystem;
    }

    public void setOperatingSystem(String operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public String getFrontCamera() {
        return frontCamera;
    }

    public void setFrontCamera(String frontCamera) {
        this.frontCamera = frontCamera;
    }

    public String getRearCamera() {
        return rearCamera;
    }

    public void setRearCamera(String rearCamera) {
        this.rearCamera = rearCamera;
    }

    public String getCpu() {
        return cpu;
    }

    public void setCpu(String cpu) {
        this.cpu = cpu;
    }

    public String getRam() {
        return ram;
    }

    public void setRam(String ram) {
        this.ram = ram;
    }

    public String getInternalMemory() {
        return internalMemory;
    }

    public void setInternalMemory(String internalMemory) {
        this.internalMemory = internalMemory;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getMemoryStick() {
        return memoryStick;
    }

    public void setMemoryStick(String memoryStick) {
        this.memoryStick = memoryStick;
    }

    public String getSim() {
        return sim;
    }

    public void setSim(String sim) {
        this.sim = sim;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }
}
