package com.ipollo.nearby_marketplace.controller;

import com.ipollo.nearby_marketplace.dto.ListingRequest;
import com.ipollo.nearby_marketplace.dto.ListingResponse;
import com.ipollo.nearby_marketplace.model.Listing;
import com.ipollo.nearby_marketplace.model.User;
import com.ipollo.nearby_marketplace.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @GetMapping
    public Page<ListingResponse> findActive(Pageable pageable) {
        return listingService.findActive(pageable).map(ListingResponse::from);
    }

    @GetMapping("/nearby")
    public Page<ListingResponse> findNearby(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "20") Double radiusKm,
            Pageable pageable) {
        return listingService.findNearby(latitude, longitude, radiusKm, pageable)
                .map(ListingResponse::from);
    }

    @GetMapping("/mine")
    public Page<ListingResponse> findMine(@AuthenticationPrincipal User currentUser, Pageable pageable) {
        return listingService.findBySeller(currentUser.getId(), pageable).map(ListingResponse::from);
    }

    @GetMapping("/{id}")
    public ListingResponse findById(@PathVariable Long id) {
        return ListingResponse.from(listingService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ListingResponse create(@Valid @RequestBody ListingRequest request,
                                  @AuthenticationPrincipal User currentUser) {
        Listing listing = listingService.create(
                request.title(), request.description(), request.price(),
                request.categoryId(), request.cityId(), currentUser
        );
        return ListingResponse.from(listing);
    }

    @PutMapping("/{id}")
    public ListingResponse update(@PathVariable Long id,
                                  @Valid @RequestBody ListingRequest request,
                                  @AuthenticationPrincipal User currentUser) {
        Listing listing = listingService.update(
                id, request.title(), request.description(), request.price(),
                request.categoryId(), currentUser
        );
        return ListingResponse.from(listing);
    }

    @PatchMapping("/{id}/sold")
    public ResponseEntity<Void> markAsSold(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        listingService.markAsSold(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        listingService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<String> uploadImage(@PathVariable Long id,
                                              @RequestParam("file") MultipartFile file,
                                              @AuthenticationPrincipal User currentUser) {
        String imageUrl = listingService.addImage(id, file, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(imageUrl);
    }

}