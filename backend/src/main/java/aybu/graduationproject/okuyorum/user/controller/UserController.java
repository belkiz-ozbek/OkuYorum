package aybu.graduationproject.okuyorum.user.controller;

import aybu.graduationproject.okuyorum.user.dto.UserDto;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.service.UserService;
import aybu.graduationproject.okuyorum.user.service.ReadingStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class UserController {

    private final UserService userService;
    private final ReadingStatsService readingStatsService;

    @Autowired
    public UserController(UserService userService, ReadingStatsService readingStatsService) {
        this.userService = userService;
        this.readingStatsService = readingStatsService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDto> userDtos = users.stream().map(user -> {
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setUsername(user.getUsername());
            userDto.setNameSurname(user.getNameSurname());
            userDto.setEmail(user.getEmail());
            userDto.setBio(user.getBio());
            userDto.setProfileImage(user.getProfileImage());
            userDto.setReaderScore(user.getReaderScore());
            userDto.setCreatedAt(user.getCreatedAt());
            return userDto;
        }).toList();
        return ResponseEntity.ok(userDtos);
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
        
        // Tüm okuma istatistiklerini güncelle
        readingStatsService.updateAllStats(id);
        
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
        userDto.setYearlyGoal(user.getYearlyGoal());
        userDto.setReadingHours(user.getReadingHours());
        userDto.setPagesRead(user.getPagesRead());
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

    @PutMapping("/{userId}/yearly-goal")
    public ResponseEntity<?> updateYearlyGoal(
            @PathVariable Long userId,
            @RequestBody Map<String, Integer> request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Kullanıcının kendi profilini düzenleyip düzenlemediğini kontrol et
            User currentUser = userService.getUserByUsername(userDetails.getUsername());
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Bu işlem için yetkiniz yok."));
            }

            Integer yearlyGoal = request.get("yearlyGoal");
            if (yearlyGoal == null || yearlyGoal < 1) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Geçersiz hedef değeri."));
            }

            userService.updateYearlyGoal(userId, yearlyGoal);
            return ResponseEntity.ok(Map.of("message", "Yıllık hedef başarıyla güncellendi."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Yıllık hedef güncellenirken bir hata oluştu."));
        }
    }

    @GetMapping("/{userId}/calculate-reading-hours")
    public ResponseEntity<String> calculateReadingHours(@PathVariable Long userId) {
        readingStatsService.updateAllStats(userId);
        return ResponseEntity.ok("Reading statistics calculation triggered for user: " + userId);
    }
}