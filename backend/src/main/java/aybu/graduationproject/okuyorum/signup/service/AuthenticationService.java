package aybu.graduationproject.okuyorum.signup.service;

import aybu.graduationproject.okuyorum.signup.dto.UserDto;
import aybu.graduationproject.okuyorum.signup.dto.UserRequest;
import aybu.graduationproject.okuyorum.signup.dto.UserResponse;
import aybu.graduationproject.okuyorum.signup.entity.User;
import aybu.graduationproject.okuyorum.signup.enums.Role;
import aybu.graduationproject.okuyorum.signup.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository, JwtService jwtService, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(UserDto userDto) {
        // Email formatı kontrolü
        if (!isValidEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Geçersiz e-posta formatı");
        }

        // Kullanıcı adı formatı kontrolü
        if (!isValidUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("Geçersiz kullanıcı adı formatı. Sadece harf, rakam ve ._- karakterleri kullanılabilir");
        }

        // Benzersizlik kontrolleri
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("Bu kullanıcı adı zaten kullanılıyor");
        }

        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Bu e-posta adresi zaten kullanılıyor");
        }

        // Şifre kontrolü
        if (!isValidPassword(userDto.getPassword())) {
            throw new IllegalArgumentException("Şifre en az 6 karakter uzunluğunda olmalıdır");
        }

        User user = User.builder()
                .username(userDto.getUsername().trim())
                .email(userDto.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .nameSurname(userDto.getNameSurname())
                .role(Role.USER)
                .build();

        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return UserResponse.builder().token(token).build();
    }

    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }

        // Email yapısını parçalara ayır
        String[] parts = email.split("@");
        if (parts.length != 2) {
            return false;
        }

        String localPart = parts[0];
        String domain = parts[1];

        // Local part kontrolü (kullanıcı adı kısmı)
        if (localPart.length() < 3 || localPart.length() > 64) {
            return false;
        }

        // Domain kontrolü
        if (!domain.contains(".")) {
            return false;
        }

        // Yaygın email servis sağlayıcıları için tam domain kontrolü
        String[] validDomains = {
            "gmail.com",
            "hotmail.com",
            "yahoo.com",
            "outlook.com",
            "icloud.com"
        };

        boolean isValidDomain = false;
        for (String validDomain : validDomains) {
            if (domain.equalsIgnoreCase(validDomain)) {
                isValidDomain = true;
                break;
            }
        }

        // Eğer yaygın domain değilse, geçerli uzantıları kontrol et
        if (!isValidDomain) {
            String[] validTlds = {
                ".edu.tr",
                ".com.tr",
                ".org.tr",
                ".gov.tr",
                ".com",
                ".org",
                ".net"
            };

            boolean hasValidTld = false;
            for (String tld : validTlds) {
                if (domain.toLowerCase().endsWith(tld)) {
                    hasValidTld = true;
                    break;
                }
            }

            if (!hasValidTld) {
                return false;
            }

            // Domain yapısının doğruluğunu kontrol et
            String[] domainParts = domain.split("\\.");
            if (domainParts.length < 2) {
                return false;
            }
        }

        // Geçerli email karakterleri kontrolü
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    private boolean isValidUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        return username.matches("^[a-zA-Z0-9._-]{3,50}$");
    }

    private boolean isValidPassword(String password) {
        return password != null && password.length() >= 6;
    }

    public UserResponse auth(UserRequest userRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userRequest.getUsername(), userRequest.getPassword()));
        User user = userRepository.findByUsername(userRequest.getUsername()).orElseThrow();
        String token = jwtService.generateToken(user);
        return UserResponse.builder().token(token).build();
    }
}
