package com.ipollo.nearby_marketplace.service;

import com.ipollo.nearby_marketplace.exception.ResourceNotFoundException;
import com.ipollo.nearby_marketplace.exception.UnauthorizedActionException;
import com.ipollo.nearby_marketplace.model.*;
import com.ipollo.nearby_marketplace.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final CategoryService categoryService;
    private final CityService cityService;

    @Transactional
    public Listing create(String title, String description, BigDecimal price,
                          Long categoryId, Long cityId, User seller) {

        Category category = categoryService.findById(categoryId);
        City city = cityService.findById(cityId);

        Listing listing = new Listing();
        listing.setTitle(title);
        listing.setDescription(description);
        listing.setPrice(price);
        listing.setCategory(category);
        listing.setCity(city);
        listing.setSeller(seller);
        listing.setStatus(ListingStatus.ACTIVE);

        return listingRepository.save(listing);
    }

    public Listing findById(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));
    }

    public Page<Listing> findActive(Pageable pageable) {
        return listingRepository.findByStatus(ListingStatus.ACTIVE, pageable);
    }

    public Page<Listing> findBySeller(Long sellerId, Pageable pageable) {
        return listingRepository.findBySellerId(sellerId, pageable);
    }

    public Page<Listing> findNearby(Double latitude, Double longitude, Double radiusKm, Pageable pageable) {
        return listingRepository.findNearby(latitude, longitude, radiusKm, ListingStatus.ACTIVE, pageable);
    }

    @Transactional
    public Listing update(Long id, String title, String description, BigDecimal price,
                          Long categoryId, User requester) {

        Listing listing = findById(id);
        assertOwnership(listing, requester);

        Category category = categoryService.findById(categoryId);

        listing.setTitle(title);
        listing.setDescription(description);
        listing.setPrice(price);
        listing.setCategory(category);

        return listingRepository.save(listing);
    }

    @Transactional
    public void markAsSold(Long id, User requester) {
        Listing listing = findById(id);
        assertOwnership(listing, requester);
        listing.setStatus(ListingStatus.SOLD);
        listingRepository.save(listing);
    }

    @Transactional
    public void delete(Long id, User requester) {
        Listing listing = findById(id);
        assertOwnership(listing, requester);
        listingRepository.delete(listing);
    }

    // Allow user to only modify his own listings
    private void assertOwnership(Listing listing, User requester) {
        if (!listing.getSeller().getId().equals(requester.getId())) {
            throw new UnauthorizedActionException("You are not allowed to modify this listing");
        }
    }
}