package org.example.ecommercemanagementsystem.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.config.JwtUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        System.out.println("======================================");
        System.out.println("JWT FILTER");
        System.out.println("METHOD : " + request.getMethod());
        System.out.println("URI    : " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");

        System.out.println(
                "AUTHORIZATION HEADER PRESENT: "
                        + (authHeader != null)
        );

        // =========================================
        // OPTIONS REQUEST
        // =========================================
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {

            System.out.println("OPTIONS REQUEST");

            filterChain.doFilter(request, response);

            return;
        }

        // =========================================
        // NO JWT
        // =========================================
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println("NO BEARER TOKEN");

            filterChain.doFilter(request, response);

            System.out.println(
                    "RESPONSE STATUS: " + response.getStatus()
            );

            System.out.println("======================================");

            return;
        }

        // =========================================
        // EXTRACT TOKEN
        // =========================================
        String token = authHeader.substring(7);

        try {

            String username =
                    jwtUtil.extractUsername(token);

            String role =
                    jwtUtil.extractRole(token);

            System.out.println("JWT USERNAME : " + username);
            System.out.println("JWT ROLE     : " + role);

            // =========================================
            // SET AUTHENTICATION
            // =========================================
            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                String authorityRole = role;

                if (authorityRole != null &&
                        !authorityRole.startsWith("ROLE_")) {

                    authorityRole = "ROLE_" + authorityRole;
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                authorityRole
                                        )
                                )
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                System.out.println(
                        "AUTHENTICATION SET SUCCESSFULLY"
                );

                System.out.println(
                        "AUTHORITY: "
                                + authentication.getAuthorities()
                );
            }

        } catch (JwtException |
                 IllegalArgumentException e) {

            System.out.println(
                    "JWT ERROR: " + e.getMessage()
            );

            SecurityContextHolder.clearContext();
        }

        // =========================================
        // CONTINUE REQUEST
        // =========================================
        filterChain.doFilter(request, response);

        System.out.println(
                "AUTHENTICATION AFTER FILTER: "
                        + SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );

        System.out.println(
                "RESPONSE STATUS: " + response.getStatus()
        );

        System.out.println("======================================");
    }
}