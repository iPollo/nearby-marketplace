package com.ipollo.nearby_marketplace.dto;

import com.ipollo.nearby_marketplace.model.User;

public record UserResponse(Long id, String name, String email, CityResponse city) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), CityResponse.from(user.getCity()));
    }
}