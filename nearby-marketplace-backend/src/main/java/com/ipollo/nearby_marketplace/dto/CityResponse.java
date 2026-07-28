package com.ipollo.nearby_marketplace.dto;

import com.ipollo.nearby_marketplace.model.City;

public record CityResponse(Long id, String name, String state) {
    public static CityResponse from(City city) {
        return new CityResponse(city.getId(), city.getName(), city.getState());
    }
}