package aybu.graduationproject.okuyorum.signup.controller;

import aybu.graduationproject.okuyorum.signup.entity.Achievement;
import aybu.graduationproject.okuyorum.signup.entity.ReadingActivity;
import aybu.graduationproject.okuyorum.signup.entity.User;
import aybu.graduationproject.okuyorum.signup.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<User> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.getUserProfile(user.getId()));
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestBody User updatedUser) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.updateUserProfile(user.getId(), updatedUser));
    }

    @GetMapping("/achievements")
    public ResponseEntity<List<Achievement>> getAchievements() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.getUserAchievements(user.getId()));
    }

    @GetMapping("/reading-activity")
    public ResponseEntity<List<ReadingActivity>> getReadingActivity() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.getUserReadingActivity(user.getId()));
    }

    @PutMapping("/achievements/{achievementId}/progress")
    public ResponseEntity<Achievement> updateAchievementProgress(
            @PathVariable Long achievementId,
            @RequestParam Integer progress) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.updateAchievementProgress(user.getId(), achievementId, progress));
    }

    @PostMapping("/reading-activity")
    public ResponseEntity<ReadingActivity> addReadingActivity(
            @RequestParam String month,
            @RequestParam Integer books) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.addReadingActivity(user.getId(), month, books));
    }

    @PutMapping("/image")
    public ResponseEntity<User> updateProfileImage(@RequestParam("file") MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.updateProfileImage(user.getId(), file));
    }

    @PutMapping("/header-image")
    public ResponseEntity<User> updateHeaderImage(@RequestParam("file") MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.updateHeaderImage(user.getId(), file));
    }
} 