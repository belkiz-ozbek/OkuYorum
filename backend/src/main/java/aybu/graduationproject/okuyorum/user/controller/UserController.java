package aybu.graduationproject.okuyorum.user.controller;

import aybu.graduationproject.okuyorum.user.dto.UserDto;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
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

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setNameSurname(user.getNameSurname());
        userDto.setEmail(user.getEmail());
        userDto.setBio(user.getBio());
        userDto.setBirthDate(user.getBirthDate());
        userDto.setProfileImage(user.getProfileImage());
        userDto.setHeaderImage(user.getHeaderImage());
        userDto.setFollowers(user.getFollowers());
        userDto.setFollowing(user.getFollowing());
        userDto.setBooksRead(user.getBooksRead());
        userDto.setReaderScore(user.getReaderScore());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setUpdatedAt(user.getUpdatedAt());
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }

    @GetMapping("/quick-search")
    public ResponseEntity<List<User>> quickSearchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.quickSearchUsers(query));
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 