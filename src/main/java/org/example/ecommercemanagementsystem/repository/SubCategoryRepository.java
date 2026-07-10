package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.SubCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategoryEntity, Long> {

    List<SubCategoryEntity> findByCategoryCategoryName(String categoryName);

    @Query("SELECT sc FROM SubCategoryEntity sc JOIN FETCH sc.category WHERE sc.subCategoryId = :id")
    Optional<SubCategoryEntity> findByIdWithCategory(@Param("id") Long id);
    Optional<SubCategoryEntity> findBySubCategoryName(String subCategoryName);
}