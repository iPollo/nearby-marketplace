package com.ipollo.nearby_marketplace.dto;

import com.ipollo.nearby_marketplace.model.Category;

public record CategoryResponse(Long id, String name) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}