package aybu.graduationproject.okuyorum.signup.controller;

import aybu.graduationproject.okuyorum.signup.dto.UserDto;
import aybu.graduationproject.okuyorum.signup.dto.UserRequest;
import aybu.graduationproject.okuyorum.signup.dto.UserResponse;
import aybu.graduationproject.okuyorum.signup.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(authenticationService.register(userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(authenticationService.auth(userRequest));
    }
}
