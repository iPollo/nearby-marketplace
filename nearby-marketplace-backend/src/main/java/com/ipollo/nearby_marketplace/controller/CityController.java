package com.ipollo.nearby_marketplace.controller;

import com.ipollo.nearby_marketplace.dto.CityResponse;
import com.ipollo.nearby_marketplace.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    @GetMapping
    public List<CityResponse> findAll() {
        return cityService.findAll().stream()
                .map(CityResponse::from)
                .toList();
    }
}