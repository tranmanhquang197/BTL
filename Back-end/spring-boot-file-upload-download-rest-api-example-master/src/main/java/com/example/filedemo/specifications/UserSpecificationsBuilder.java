//package com.example.filedemo.specifications;
//
//import com.example.filedemo.entites.User;
//import org.springframework.data.jpa.domain.Specification;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.stream.Collectors;
//
//public class UserSpecificationsBuilder {
//
//    private final List<SearchCriteria> params;
//    private UserSpecification userSpecification;
//
//    public UserSpecificationsBuilder() {
//        params = new ArrayList<SearchCriteria>();
//    }
//
//    public UserSpecificationsBuilder with(String key, String operation, Object value) {
//        params.add(new SearchCriteria(key, operation, value));
//        return this;
//    }
//
//    public Specification<User> build() {
//        if (params.size() == 0) {
//            return null;
//        }
//
//
//
//        Specification result = new UserSpecification(params.get(0));
//
//        for (int i = 1; i < params.size(); i++) {
//            result = params.get(i)
//                    .isOrPredicate()
//                    ? Specification.where(result)
//                    .or(new UserSpecification(params.get(i)))
//                    : Specification.where(result)
//                    .and(new UserSpecification(params.get(i)));
//        }
//        return result;
//    }
//}
