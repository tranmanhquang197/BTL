package com.example.filedemo.repository.custom;

import com.example.filedemo.entites.Order;
import com.example.filedemo.entites.Product;
import com.example.filedemo.entites.ProductType;
import com.example.filedemo.entites.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.ColumnResult;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

import static org.springframework.util.Assert.notEmpty;

@Repository
public class UserRepositoryImpl implements UserRepositoryCustom {

    @PersistenceContext
    private EntityManager em;


    @Override
    public List<User> findByIdTest() {
        String nativeQueryString = "select username  from cvserver.users ";


        Query nativeQuery = em.createNativeQuery(nativeQueryString);

        List<User> bannerResources = nativeQuery.getResultList();

        return bannerResources;
    }

    @Override
    @org.springframework.data.jpa.repository.Query(nativeQuery = true)
    public Page<Product> findProduct(String name, Integer productType, String fromDate, String toDate, Integer pageNumber, Integer pageSize, Pageable pageable) {
        String nativeQueryString = "select id,name,status,count,rest,price,sale,product_types ,  " +
                "(\n" +
                "\tselect att.url from cvserver.attach_ment att\n" +
                "\tJoin cvserver.m_product_attachment m_att on p.id = m_att.product_id\n" +
                "\tlimit 1\n" +
                ") url ,to_char( create_date, 'DD-MM-YYYY HH:MM') as create_date " +
                "from cvserver.product p where 1=1  ";

        int offset = 0;
        if (pageNumber == 0) {
            offset = 0;
        } else if (pageNumber > 0) {
            offset = pageNumber * pageSize;
        }
        if (!name.isEmpty()) {
            nativeQueryString += " and name = :name  ";
        }
        if (productType != null) {
            nativeQueryString += " and product_types = :productType  ";
        }
        if (!fromDate.isEmpty() && !toDate.isEmpty()) {
            nativeQueryString += " and create_date > :fromDate and create_date < :toDate  ";
        }
        nativeQueryString += " ORDER BY id DESC offset :offset limit :pageSize ";

        Query nativeQuery = em.createNativeQuery(nativeQueryString, "ProductMapping");

        if (!name.isEmpty()) {
            nativeQuery.setParameter("name", name);
        }

        if (productType != null) {
            nativeQuery.setParameter("productType", productType);
        }

        if (!fromDate.isEmpty() && !toDate.isEmpty()) {
            nativeQuery.setParameter("fromDate", fromDate);
            nativeQuery.setParameter("toDate", toDate);
        }
        ;
        nativeQuery.setParameter("offset", offset);
        nativeQuery.setParameter("pageSize", pageSize);


        List<Product> products = (List<Product>) nativeQuery.getResultList();

        return new PageImpl<Product>(products, pageable, 10);
    }

    @Override
    public Page<User> findUser(String username, String phone, Integer status, Integer roles, Integer pageNumber, Integer pageSize, Pageable pageable) {


        String nativeQueryString = " select id,username,phone ,image ,status,to_char( create_date, 'DD-MM-YYYY HH:MM') as create_date, " +
                "(select name from cvserver.role role " +
                " where role.id = users.roles ) as roles " +
                "from cvserver.users  where 1=1 ";

        int offset = 0;
        if (pageNumber == 0) {
            offset = 0;
        } else if (pageNumber > 0) {
            offset = pageNumber * pageSize;
        }
        if (!username.isEmpty()) {
            nativeQueryString += " and username = :username  ";
        }
        if (!phone.isEmpty()) {
            nativeQueryString += " and phone = :phone  ";
        }
        if (status != null) {
            nativeQueryString += " and status = :status ";
        }

        if (roles != null) {
            nativeQueryString += " and role = :role ";
        }

        nativeQueryString += " ORDER BY id DESC offset :offset limit :pageSize ";

        Query nativeQuery = em.createNativeQuery(nativeQueryString, "UserMapping");

        if (!username.isEmpty()) {
            nativeQuery.setParameter("username", username);
        }

        if (!phone.isEmpty()) {
            nativeQuery.setParameter("phone", phone);
        }

        if (status != null) {
            nativeQuery.setParameter("status", status);
        }
        ;
        if (roles != null) {
            nativeQuery.setParameter("roles", roles);
        }
        ;

        nativeQuery.setParameter("offset", offset);
        nativeQuery.setParameter("pageSize", pageSize);


        List<User> users = (List<User>) nativeQuery.getResultList();

        return new PageImpl<User>(users, pageable, 10);
    }

    @Override
    public Page<ProductType> findProductType(String name, Integer status, String fromDate, String toDate, Integer pageNumber, Integer pageSize, Pageable pageable) {
        String nativeQueryString = "select id,name,status,image, to_char( create_date, 'DD-MM-YYYY HH:MM') as create_date  " +
                "from cvserver.product_type p " +
                "where 1=1 ";

        int offset = 0;
        if (pageNumber == 0) {
            offset = 0;
        } else if (pageNumber > 0) {
            offset = pageNumber * pageSize;
        }
        if (!name.isEmpty()) {
            nativeQueryString += " and name = :name  ";
        }
        if (status != null) {
            nativeQueryString += " and status = :status  ";
        }
        if (!fromDate.isEmpty() && !toDate.isEmpty()) {
            nativeQueryString += " and create_date > :fromDate and create_date < :toDate  ";
        }
            nativeQueryString += " ORDER BY id DESC offset :offset limit :pageSize ";

            Query nativeQuery = em.createNativeQuery(nativeQueryString, "ProductTypeMapping");

            if (!name.isEmpty()) {
                nativeQuery.setParameter("name", name);
            }

            if (status != null) {
                nativeQuery.setParameter("status", status);
            }


            if (!fromDate.isEmpty() && !toDate.isEmpty()) {
                nativeQuery.setParameter("fromDate", fromDate);
                nativeQuery.setParameter("toDate", toDate);
            }
            ;

            nativeQuery.setParameter("offset", offset);
            nativeQuery.setParameter("pageSize", pageSize);


            List<ProductType> users = (List<ProductType>) nativeQuery.getResultList();

            return new PageImpl<ProductType>(users, pageable, 10);
        }

    @Override
    public Page<Order> findOrder(String name, Integer status, String fromDate, String toDate, Integer pageNumber, Integer pageSize, Pageable pageable) {

        String nativeQueryString = " SELECT id,(select image from cvserver.order_details detail\n" +
                " where orders.id = detail.order_detail_id\n" +
                " limit 1\n" +
                ") as image ,\n" +
                "(select product_name from cvserver.order_details detail\n" +
                " where orders.id = detail.order_detail_id\n" +
                " limit 1\n" +
                " ) as name ,\n" +
                " name as orderName,\n" +
                " total_price as price ,\n" +
                " status_order as status ,\n" +
                " to_char( order_date, 'DD-MM-YYYY HH:MM') as create_date\n" +
                " FROM cvserver.order orders  where 1=1 ";

        int offset = 0;
        if (pageNumber == 0) {
            offset = 0;
        } else if (pageNumber > 0) {
            offset = pageNumber * pageSize;
        }
        if (!name.isEmpty()) {
            nativeQueryString += " and name = :name  ";
        }
        if (status != null) {
            nativeQueryString += " and status = :status  ";
        }
        if (!fromDate.isEmpty() && !toDate.isEmpty()) {
            nativeQueryString += " and create_date > :fromDate and create_date < :toDate  ";
        }
        nativeQueryString += " ORDER BY id DESC offset :offset limit :pageSize ";

        Query nativeQuery = em.createNativeQuery(nativeQueryString, "OrderMapping");

        if (!name.isEmpty()) {
            nativeQuery.setParameter("name", name);
        }

        if (status != null) {
            nativeQuery.setParameter("status", status);
        }


        if (!fromDate.isEmpty() && !toDate.isEmpty()) {
            nativeQuery.setParameter("fromDate", fromDate);
            nativeQuery.setParameter("toDate", toDate);
        }
        ;

        nativeQuery.setParameter("offset", offset);
        nativeQuery.setParameter("pageSize", pageSize);


        List<Order> orders = (List<Order>) nativeQuery.getResultList();

        return new PageImpl<Order>(orders, pageable, 10);

    }
}