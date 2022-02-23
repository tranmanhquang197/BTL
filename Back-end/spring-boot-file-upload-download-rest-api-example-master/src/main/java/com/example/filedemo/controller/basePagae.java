package com.example.filedemo.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class basePagae<T> {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String message;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER)
    private Date timestamp = new Date();

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T content;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer totalItemOfData;

    /**
     * Default constructor
     */
    public basePagae() {
    }


    public static <T> basePagae<T> success(T responseObject, String message) {
        basePagae<T> res = new basePagae<>();
        res.setMessage(message);
        res.setContent(responseObject);


        return res;
    }



    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public T getContent() {
        return content;
    }

    public void setContent(T content) {
        this.content = content;
    }

    public Integer getTotalItemOfData() {
        return totalItemOfData;
    }

    public void setTotalItemOfData(Integer totalItemOfData) {
        this.totalItemOfData = totalItemOfData;
    }
}
