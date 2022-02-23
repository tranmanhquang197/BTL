package com.example.filedemo.dto;

import java.util.Collection;
import java.util.List;

public class dtoProject {
    private int id;
    private String  name;
    private List<String> developers;

    public dtoProject(int id, String name, List<String> developers) {
        this.id = id;
        this.name = name;
        this.developers = developers;
    }

    public dtoProject() {

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

    public Collection<String> getDevelopers() {
        return developers;
    }

    public void setDevelopers(List<String> developers) {
        this.developers = developers;
    }
}
