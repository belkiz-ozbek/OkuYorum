package aybu.graduationproject.okuyorum.user.controller;

import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.service.UserFollowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserFollowingController {

    @Autowired
    private UserFollowingService userFollowingService;

    @PostMapping("/{userId}/follow")
    public ResponseEntity<?> followUser(
            Authentication authentication,
            @PathVariable Long userId) {
        User currentUser = (User) authentication.getPrincipal();
        userFollowingService.followUser(currentUser.getId(), userId);
        return ResponseEntity.ok(Map.of("message", "Kullanıcı başarıyla takip edildi"));
    }

    @DeleteMapping("/{userId}/unfollow")
    public ResponseEntity<?> unfollowUser(
            Authentication authentication,
            @PathVariable Long userId) {
        User currentUser = (User) authentication.getPrincipal();
        userFollowingService.unfollowUser(currentUser.getId(), userId);
        return ResponseEntity.ok(Map.of("message", "Kullanıcı takipten çıkarıldı"));
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(userFollowingService.getFollowers(userId));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(userFollowingService.getFollowing(userId));
    }

    @GetMapping("/{userId}/is-following/{targetUserId}")
    public ResponseEntity<Boolean> isUserFollowing(
            @PathVariable Long userId,
            @PathVariable Long targetUserId) {
        return ResponseEntity.ok(userFollowingService.isFollowing(userId, targetUserId));
    }

    @GetMapping("/{userId}/is-following")
    public ResponseEntity<Boolean> isCurrentUserFollowing(
            Authentication authentication,
            @PathVariable Long userId) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(userFollowingService.isFollowing(currentUser.getId(), userId));
    }
} 