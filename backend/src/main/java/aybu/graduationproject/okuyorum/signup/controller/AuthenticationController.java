package aybu.graduationproject.okuyorum.signup.controller;

import aybu.graduationproject.okuyorum.signup.dto.AuthenticationRequest;
import aybu.graduationproject.okuyorum.signup.dto.AuthenticationResponse;
import aybu.graduationproject.okuyorum.signup.dto.UserDto;
import aybu.graduationproject.okuyorum.signup.dto.UserRequest;
import aybu.graduationproject.okuyorum.signup.dto.UserResponse;
import aybu.graduationproject.okuyorum.signup.dto.VerificationRequest;
import aybu.graduationproject.okuyorum.signup.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/pre-register")
    public ResponseEntity<UserResponse> preRegister(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(authenticationService.preRegister(userDto));
    }

    @PostMapping("/verify-and-register")
    public ResponseEntity<UserResponse> verifyAndRegister(@RequestBody VerificationRequest request) {
        return ResponseEntity.ok(authenticationService.verifyAndRegister(
            request.getVerificationCode(), 
            request.getTokenId()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
