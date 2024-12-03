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

    public UserResponse save(UserDto userDto) {
        User user = User.builder()
                .username(userDto.getUsername())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .nameSurname(userDto.getNameSurname())
                .role(Role.USER).build();
        userRepository.save(user);
        var token = jwtService.generateToken(user);
        return UserResponse.builder().token(token).build();

    }

    public UserResponse auth(UserRequest userRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userRequest.getUsername(), userRequest.getPassword()));
        User user = userRepository.findByUsername(userRequest.getUsername()).orElseThrow();
        String token = jwtService.generateToken(user);
        return UserResponse.builder().token(token).build();
    }
}
