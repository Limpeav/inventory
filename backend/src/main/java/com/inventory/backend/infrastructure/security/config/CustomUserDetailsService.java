package com.inventory.backend.infrastructure.security.config;

import com.inventory.backend.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Standalone UserDetailsService — extracted from SecurityConfig to break the circular dependency:
 * SecurityConfig → JwtFilter → UserDetailsService → SecurityConfig
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        com.inventory.backend.domain.user.User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or username: " + identifier));

        List<SimpleGrantedAuthority> authorities = user.getRoles() == null ? List.of() :
                user.getRoles().stream()
                        .flatMap(role -> {
                            List<SimpleGrantedAuthority> roleAuth = List.of(
                                    new SimpleGrantedAuthority("ROLE_" + role.getName())
                            );
                            List<SimpleGrantedAuthority> permAuth = role.getPermissions() != null
                                    ? role.getPermissions().stream()
                                            .map(p -> new SimpleGrantedAuthority(p.getName()))
                                            .collect(Collectors.toList())
                                    : List.of();
                            return java.util.stream.Stream.concat(roleAuth.stream(), permAuth.stream());
                        })
                        .collect(Collectors.toList());

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .accountExpired(false)
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
    }
}
