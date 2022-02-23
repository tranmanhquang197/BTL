//package com.example.filedemo.repository.custom;
//
//import com.example.filedemo.dto.dtoProductNew;
//import com.example.filedemo.entites.Product;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Repository;
//
//import javax.persistence.EntityManager;
//import javax.persistence.PersistenceContext;
//import javax.persistence.Query;
//import java.util.List;
//
//@Repository
//@RequiredArgsConstructor
//public class ProductRepositoriImpl implements  ProductRepositoryCustom{
//
//    @PersistenceContext
//    private EntityManager em;
//
//    @Override
//    public List<dtoProductNew> findProduct(String name, Integer productType, String fromDate, String toDate, Integer pageNumber, Integer pageSize) {
//        String nativeQueryString = "select * from cvserver.product p where ";
//
//        int offset;
//        if(pageNumber == 0){
//            offset = 0;
//        }
//        else if(pageNumber > 0 ){
//            offset = pageNumber * pageSize;
//        }
//        if (name!= null){
//            nativeQueryString += " name = :name and ";
//        }
//        if (productType != null){
//            nativeQueryString += " product_types = :productType and ";
//        }
//        if (fromDate!= null && toDate!= null){
//            nativeQueryString += " create_date > :fromDate and create_date < :toDate and ";
//        }
//        if (name!= null){
//            nativeQueryString += " ORDER BY id DESC offset :offset limit :pageSize ";
//        }
//
//        Query nativeQuery = em.createNativeQuery(nativeQueryString);
//
//        List<dtoProductNew> products = nativeQuery.getResultList();
//
//        return products;
//    }
//
//
////    @Override
////    public Page<Product> findAllProduct(String name, int productType, String fromDate, String toDate, Pageable pageable) {
////
////
////        String nativeQueryString = "select * from cvserver.product p\" +\n" +
////                "                    \" where p.name = :name and \" +\n";
////        Query nativeQuery = em.createNativeQuery(nativeQueryString);
////
////        Page<Product> products = (Page<Product>) nativeQuery.getResultList();
////
////        return products;
////
////    }
//}
