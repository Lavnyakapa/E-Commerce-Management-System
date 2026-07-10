package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository <CategoryEntity,Long>{
    Optional<CategoryEntity> findByCategoryName(String categoryName);
    boolean existsByCategoryName(String categoryName);
}
