package com.example.filedemo.repository;
        import com.example.filedemo.dto.responseUser;
        import com.example.filedemo.entites.Product;
        import com.example.filedemo.entites.User;
        import com.example.filedemo.repository.custom.UserRepositoryCustom;
        import org.springframework.data.domain.Page;
        import org.springframework.data.domain.Pageable;
        import org.springframework.data.jpa.repository.JpaRepository;
        import org.springframework.data.jpa.repository.Query;
        import org.springframework.data.repository.query.Param;
        import java.util.Date;
        import java.util.List;
        import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {

//    List<User> findByCreateDateBetween(Date from, Date to);
    public User findByUsernameAndPassword(String username,String password);
//    public User findByUsername(String username);
    public User findById(int id);




//    @Query(
//            value = " select email,username from cvserver.users " +
//                    " offset :offset limit :limit",
//            nativeQuery = true)
//    List<dtoTest> findAllUsersWithPagination(@Param("offset") int offset,@Param("limit") int limit);




}
