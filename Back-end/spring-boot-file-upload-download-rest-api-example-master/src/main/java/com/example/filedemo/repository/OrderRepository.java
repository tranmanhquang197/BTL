package com.example.filedemo.repository;
        import com.example.filedemo.dto.dtoUserProduct;
        import com.example.filedemo.dto.responseProduct;
        import com.example.filedemo.entites.Order;
        import com.example.filedemo.entites.User;
        import org.springframework.data.jpa.repository.JpaRepository;
        import org.springframework.data.jpa.repository.Query;

        import java.util.Date;
        import java.util.List;


public interface OrderRepository extends JpaRepository<Order, Long>{

    Order findById(int id);
    List<Order> findByStatusOrderAndPaymentConfirmation(int statusOrder,int paymentConfrim);

    List<Order> findByOrderDateBetweenAndStatusOrder(Date from, Date to,int status);

    List<Order> findByPaymentConfirmation(int PaymentConfirmation);
    Order findByUserId(int id);

    @Query("SELECT new com.example.filedemo.dto.dtoUserProduct(o.id,d.id,o.orderDate,d.productName,d.image,d.count,d.price,o.totalPrice) FROM Order o  JOIN o.orderDetail d  WHERE  o.userId = ?1")
    public List<dtoUserProduct> getProductUser(int user);
}
