package com.ipollo.nearby_marketplace.service;

import com.ipollo.nearby_marketplace.exception.ResourceNotFoundException;
import com.ipollo.nearby_marketplace.model.Category;
import com.ipollo.nearby_marketplace.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
}