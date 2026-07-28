package com.ipollo.nearby_marketplace.dto;

import com.ipollo.nearby_marketplace.model.Listing;
import com.ipollo.nearby_marketplace.model.ListingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ListingResponse(
        Long id,
        String title,
        String description,
        BigDecimal price,
        ListingStatus status,
        CategoryResponse category,
        CityResponse city,
        String sellerName,
        Long sellerId,
        List<String> imageUrls,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ListingResponse from(Listing listing) {
        return new ListingResponse(
                listing.getId(),
                listing.getTitle(),
                listing.getDescription(),
                listing.getPrice(),
                listing.getStatus(),
                CategoryResponse.from(listing.getCategory()),
                CityResponse.from(listing.getCity()),
                listing.getSeller().getName(),
                listing.getSeller().getId(),
                listing.getImages().stream().map(img -> img.getImageUrl()).toList(),
                listing.getCreatedAt(),
                listing.getUpdatedAt()
        );
    }
}