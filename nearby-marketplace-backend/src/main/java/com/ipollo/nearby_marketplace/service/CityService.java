package com.ipollo.nearby_marketplace.service;

import com.ipollo.nearby_marketplace.exception.ResourceNotFoundException;
import com.ipollo.nearby_marketplace.model.City;
import com.ipollo.nearby_marketplace.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository cityRepository;

    public List<City> findAll() {
        return cityRepository.findAll();
    }

    public City findById(Long id) {
        return cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + id));
    }
}