package com.example.filedemo.dto;

public class dtoPerson {
    private String fileName;
    private String email;
    private byte[] image;

    public dtoPerson() {
    }

    public dtoPerson(String fileName, String email, byte[] image) {
        this.fileName = fileName;
        this.email = email;
        this.image = image;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }
}
