package aybu.graduationproject.okuyorum.security.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import aybu.graduationproject.okuyorum.user.service.UserService;
import aybu.graduationproject.okuyorum.user.entity.User;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${security.jwt.secret}")
    private String SECRET_KEY;

    @Autowired
    private UserService userService;

    public String findUsername(String token) {
        return exportToken(token, Claims::getSubject);
    }

    private <T> T exportToken(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build().parseClaimsJws(token).getBody();

        return claimsTFunction.apply(claims);
    }

    private Key getKey() {
        byte[] key = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(key);
    }

    public boolean tokenControl(String jwt, UserDetails userDetails) {
        final String username = findUsername(jwt);
        final Date expiration = exportToken(jwt, Claims::getExpiration);
        final boolean isExpired = expiration.before(new Date());
        
        System.out.println("Token Control - Username match: " + username.equals(userDetails.getUsername()));
        System.out.println("Token Control - Expiration: " + expiration);
        System.out.println("Token Control - Is expired: " + isExpired);
        
        return (username.equals(userDetails.getUsername()) && !isExpired);
    }

    public String generateToken(UserDetails user) {
        Map<String, Object> claims = new HashMap<>();
        var authorities = user.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toList());
        claims.put("roles", authorities);
        
        System.out.println("Generating token for user: " + user.getUsername());
        System.out.println("User authorities: " + authorities);
                
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isCurrentUser(Long userId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return false;
            }

            String username = authentication.getName();
            User user = userService.getUserById(userId);
            return user.getUsername().equals(username);
        } catch (EntityNotFoundException e) {
            return false;
        }
    }
} 