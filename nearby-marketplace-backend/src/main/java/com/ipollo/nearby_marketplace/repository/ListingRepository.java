package com.ipollo.nearby_marketplace.repository;

import com.ipollo.nearby_marketplace.model.Listing;
import com.ipollo.nearby_marketplace.model.ListingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    Page<Listing> findByStatus(ListingStatus status, Pageable pageable);

    Page<Listing> findBySellerId(Long sellerId, Pageable pageable);

    Page<Listing> findByCategoryIdAndStatus(Long categoryId, ListingStatus status, Pageable pageable);

    // Query to apply Haversine method to find shortest straight-line distance on the surface of a sphere
    @Query(value = """
    SELECT l.* FROM listings l
    JOIN cities c ON l.city_id = c.id
    WHERE l.status = :#{#status.name()}
    AND (
        6371 * acos(
            LEAST(1.0, GREATEST(-1.0,
                cos(radians(:latitude)) * cos(radians(c.latitude)) *
                cos(radians(c.longitude) - radians(:longitude)) +
                sin(radians(:latitude)) * sin(radians(c.latitude))
            ))
        )
    ) <= :radiusKm
    """,
            countQuery = """
    SELECT count(*) FROM listings l
    JOIN cities c ON l.city_id = c.id
    WHERE l.status = :#{#status.name()}
    AND (
        6371 * acos(
            LEAST(1.0, GREATEST(-1.0,
                cos(radians(:latitude)) * cos(radians(c.latitude)) *
                cos(radians(c.longitude) - radians(:longitude)) +
                sin(radians(:latitude)) * sin(radians(c.latitude))
            ))
        )
    ) <= :radiusKm
    """,
            nativeQuery = true)
    Page<Listing> findNearby(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("radiusKm") Double radiusKm,
            @Param("status") ListingStatus status,
            Pageable pageable
    );
}