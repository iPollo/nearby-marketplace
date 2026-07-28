package com.ipollo.nearby_marketplace.repository;


import com.ipollo.nearby_marketplace.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Long> {

    Optional<City> findByNameAndState(String name, String state);
}