package aybu.graduationproject.okuyorum.auth.service;

import aybu.graduationproject.okuyorum.auth.dto.UserDto;
import aybu.graduationproject.okuyorum.auth.dto.UserResponse;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.entity.VerificationToken;
import aybu.graduationproject.okuyorum.user.enums.Role;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import aybu.graduationproject.okuyorum.user.repository.VerificationTokenRepository;
import aybu.graduationproject.okuyorum.security.service.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Random;
import jakarta.mail.MessagingException;
import java.time.LocalDateTime;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.regex.Pattern;
import aybu.graduationproject.okuyorum.auth.dto.AuthenticationRequest;
import aybu.graduationproject.okuyorum.auth.dto.AuthenticationResponse;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.BadCredentialsException;
import aybu.graduationproject.okuyorum.common.service.EmailService;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    private final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    public AuthenticationService(UserRepository userRepository,
                               VerificationTokenRepository tokenRepository,
                               EmailService emailService,
                               JwtService jwtService,
                               AuthenticationManager authenticationManager,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = new ObjectMapper();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            // Kullanıcı adı kontrolü
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                throw new RuntimeException("Kullanıcı adı boş olamaz");
            }

            // Şifre kontrolü
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new RuntimeException("Şifre boş olamaz");
            }

            // Kullanıcı var mı kontrolü
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            // Hesap aktif mi kontrolü
            if (!user.isEnabled()) {
                throw new RuntimeException("Hesabınız aktif değil. Lütfen e-posta adresinizi doğrulayın.");
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            user = (User) authentication.getPrincipal();
            String jwtToken = jwtService.generateToken(user);
            
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
        } catch (DisabledException e) {
            throw new RuntimeException("Kullanıcı hesabı aktif değil");
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Geçersiz kullanıcı adı veya şifre");
        } catch (AuthenticationException e) {
            throw new RuntimeException("Kimlik doğrulama hatası: " + e.getMessage());
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Login error: ", e);
            throw new RuntimeException("Giriş yapılırken bir hata oluştu");
        }
    }

    public UserResponse preRegister(UserDto userDto) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanılıyor");
        }
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Bu email adresi zaten kullanılıyor");
        }

        if (!isValidEmail(userDto.getEmail())) {
            throw new RuntimeException("Geçersiz email formatı");
        }
        if (!isValidUsername(userDto.getUsername())) {
            throw new RuntimeException("Geçersiz kullanıcı adı formatı");
        }

        String verificationCode = generateVerificationCode();
        
        try {
            emailService.sendVerificationEmail(userDto.getEmail(), verificationCode);
        } catch (MessagingException e) {
            throw new RuntimeException("Doğrulama e-postası gönderilemedi");
        }

        VerificationToken tempToken = new VerificationToken();
        tempToken.setToken(verificationCode);
        tempToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        
        try {
            tempToken.setUserData(objectMapper.writeValueAsString(userDto));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Kullanıcı verisi işlenirken hata oluştu");
        }
        
        tokenRepository.save(tempToken);

        return UserResponse.builder()
                .message("Doğrulama kodu e-posta adresinize gönderildi")
                .tempToken(tempToken.getId())
                .build();
    }

    public UserResponse verifyAndRegister(String verificationCode, Long tokenId) {
        VerificationToken token = tokenRepository.findByIdAndUsedFalse(tokenId)
                .orElseThrow(() -> new RuntimeException("Geçersiz doğrulama isteği"));

        if (token.isExpired()) {
            throw new RuntimeException("Doğrulama kodunun süresi dolmuş");
        }

        if (!token.getToken().equals(verificationCode)) {
            throw new RuntimeException("Geçersiz doğrulama kodu");
        }

        UserDto userDto;
        try {
            userDto = objectMapper.readValue(token.getUserData(), UserDto.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Kullanıcı verisi işlenirken hata oluştu");
        }

        User user = new User();
        user.setUsername(userDto.getUsername().trim());
        user.setEmail(userDto.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setNameSurname(userDto.getNameSurname());
        user.setRole(Role.USER);
        user.setEnabled(true);

        logger.info("Creating new user: {}", user.getUsername());
        user = userRepository.save(user);
        logger.info("User created successfully: {}", user.getUsername());

        token.setUsed(true);
        tokenRepository.save(token);

        String jwtToken = jwtService.generateToken(user);

        return UserResponse.builder()
                .token(jwtToken)
                .message("Kayıt işlemi başarıyla tamamlandı")
                .build();
    }

    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        return Pattern.compile(emailRegex)
                .matcher(email)
                .matches();
    }

    private boolean isValidUsername(String username) {
        String usernameRegex = "^[a-zA-Z0-9._-]{3,20}$";
        return Pattern.compile(usernameRegex)
                .matcher(username)
                .matches();
    }
} 