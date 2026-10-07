package org.example.ecommercemanagementsystem.config;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // =========================================
                // CORS
                // =========================================
                .cors(cors -> {})

                // =========================================
                // CSRF
                // =========================================
                .csrf(csrf -> csrf.disable())

                // =========================================
                // STATELESS JWT
                // =========================================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =========================================
                // AUTHORIZATION
                // =========================================
                .authorizeHttpRequests(auth -> auth

                        // -----------------------------------------
                        // PUBLIC APIs
                        // -----------------------------------------
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/subcategories/**"
                        ).permitAll()

                        // -----------------------------------------
                        // LOGIN / REGISTER
                        // -----------------------------------------
                        .requestMatchers(
                                "/login",
                                "/register"
                        ).permitAll()

                        // -----------------------------------------
                        // CART - LOGIN REQUIRED
                        // -----------------------------------------
                        .requestMatchers(
                                "/api/cart/**"
                        ).authenticated()

                        // -----------------------------------------
                        // WISHLIST - LOGIN REQUIRED
                        // -----------------------------------------
                        .requestMatchers(
                                "/api/wishlist/**"
                        ).authenticated()

                        // -----------------------------------------
                        // OTHER REQUESTS
                        // -----------------------------------------
                        .anyRequest().permitAll()
                )

                // =========================================
                // JWT FILTER
                // =========================================
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // =========================================
    // CORS CONFIGURATION
    // =========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // React/Vite frontend
        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        // Allowed HTTP methods
        configuration.setAllowedMethods(
                List.of(
                        HttpMethod.GET.name(),
                        HttpMethod.POST.name(),
                        HttpMethod.PUT.name(),
                        HttpMethod.PATCH.name(),
                        HttpMethod.DELETE.name(),
                        HttpMethod.OPTIONS.name()
                )
        );

        // Allow Authorization header
        configuration.setAllowedHeaders(
                List.of("*")
        );

        // Allow credentials
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}