package aybu.graduationproject.okuyorum.user.controller;

import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            User currentUser = userService.getCurrentUser();
            
            Map<String, Object> userDto = new HashMap<>();
            userDto.put("id", currentUser.getId());
            userDto.put("username", currentUser.getUsername());
            userDto.put("email", currentUser.getEmail());
            userDto.put("nameSurname", currentUser.getNameSurname());
            userDto.put("role", currentUser.getRole().name());
            
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Kullanıcı bilgileri alınırken bir hata oluştu: " + e.getMessage()));
        }
    }
} 