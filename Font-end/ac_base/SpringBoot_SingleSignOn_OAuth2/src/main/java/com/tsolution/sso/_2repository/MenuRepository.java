package com.tsolution.sso._2repository;

import com.tsolution.sso._1entities.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long>, MenuRepositoryCustom {

    Menu findOneByCode(String code);

    List<Menu> findAllByClientId(String clientId);

    @Query(value = "DELETE FROM role_menu WHERE menu_id = :menuId", nativeQuery = true)
    void deleteReferenceWithMenuId(@Param("menuId") Long menuId);

}
