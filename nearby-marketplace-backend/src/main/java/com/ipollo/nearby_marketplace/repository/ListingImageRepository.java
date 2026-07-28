package com.ipollo.nearby_marketplace.repository;

import com.ipollo.nearby_marketplace.model.ListingImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListingImageRepository extends JpaRepository<ListingImage, Long> {

    List<ListingImage> findByListingId(Long listingId);
}