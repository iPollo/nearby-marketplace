package com.ipollo.nearby_marketplace.service;

import com.ipollo.nearby_marketplace.exception.DuplicateResourceException;
import com.ipollo.nearby_marketplace.exception.ResourceNotFoundException;
import com.ipollo.nearby_marketplace.model.City;
import com.ipollo.nearby_marketplace.model.User;
import com.ipollo.nearby_marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CityService cityService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(String name, String email, String rawPassword, Long cityId) {
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already in use: " + email);
        }

        City city = cityService.findById(cityId);

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setCity(city);

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}