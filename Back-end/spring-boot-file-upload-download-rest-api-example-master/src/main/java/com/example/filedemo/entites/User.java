package com.example.filedemo.entites;


import com.example.filedemo.dto.dtoProductNew;
import com.example.filedemo.dto.dtoUserNew;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@SqlResultSetMapping(
        name = "UserMapping",
        classes = {
                @ConstructorResult(targetClass = dtoUserNew.class,
                        columns = {
                                @ColumnResult(name = "id", type = int.class),
                                @ColumnResult(name = "username", type = String.class),
                                @ColumnResult(name = "phone", type = String.class),
                                @ColumnResult(name = "image", type = String.class),
                                @ColumnResult(name = "status", type = Integer.class),
                                @ColumnResult(name = "create_date", type = String.class),
                                @ColumnResult(name = "roles", type = String.class),

                        }
                ),
        }
)

@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue
    private Integer id;

    @Column
    private String username;

    @Column
    private  String password;

    @Column
    private  String email;

    @Column
    private String address;

    @Column
    private String phone;

    @Column
    private Integer status;

    @Column
    private String image;

    @Column
    private String sdt;



    @Column(name = "createDate")
    private Date createDate;


    @ManyToOne(targetEntity = Role.class,cascade = CascadeType.ALL)
    @JoinColumn(name = "roles", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Role role;

    @OneToMany(targetEntity = Order.class,cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id",referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Order> order;

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public Role getRoles() {
        return role;
    }

    public void setRoles(Role roles) {
        this.role =  roles;
}

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Order> getOrder() {
        return order;
    }

    public void setOrder(List<Order> order) {
        this.order = order;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}








