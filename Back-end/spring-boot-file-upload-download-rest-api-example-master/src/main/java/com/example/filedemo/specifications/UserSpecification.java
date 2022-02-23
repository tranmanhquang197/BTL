//package com.example.filedemo.specifications;
//
//import com.example.filedemo.entites.User;
//import org.springframework.data.jpa.domain.Specification;
//
//import javax.persistence.criteria.CriteriaBuilder;
//import javax.persistence.criteria.CriteriaQuery;
//import javax.persistence.criteria.Predicate;
//import javax.persistence.criteria.Root;
//
//
//public class UserSpecification implements Specification<User> {
//
//    private SearchCriteria criteria;
//
//    public UserSpecification(SearchCriteria searchCriteria) {
//    }
//
//    @Override
//    public Predicate toPredicate
//            (Root<User> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
//
//        if (criteria.getOperation().equalsIgnoreCase(">")) {
//            return builder.greaterThanOrEqualTo(
//                    root.<String> get(criteria.getKey()), criteria.getValue().toString());
//        }
//        else if (criteria.getOperation().equalsIgnoreCase("<")) {
//            return builder.lessThanOrEqualTo(
//                    root.<String> get(criteria.getKey()), criteria.getValue().toString());
//        }
//        else if (criteria.getOperation().equalsIgnoreCase(":")) {
//            if (root.get(criteria.getKey()).getJavaType() == String.class) {
//                return builder.like(
//                        root.<String>get(criteria.getKey()), "%" + criteria.getValue() + "%");
//            } else {
//                return builder.equal(root.get(criteria.getKey()), criteria.getValue());
//            }
//        }
//        return null;
//    }
//}
