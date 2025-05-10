package aybu.graduationproject.okuyorum.profile.controller;

import aybu.graduationproject.okuyorum.profile.entity.Achievement;
import aybu.graduationproject.okuyorum.profile.entity.AchievementType;
import aybu.graduationproject.okuyorum.profile.service.AchievementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Achievement>> getUserAchievements(@PathVariable Long userId) {
        List<Achievement> achievements = achievementService.getUserAchievements(userId);
        return ResponseEntity.ok(achievements);
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<Achievement> getAchievement(
            @PathVariable Long userId,
            @PathVariable AchievementType type) {
        Achievement achievement = achievementService.getAchievement(userId, type);
        if (achievement == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(achievement);
    }

    @PostMapping("/book-worm/{userId}")
    public ResponseEntity<Void> updateBookWormProgress(
            @PathVariable Long userId,
            @RequestParam int count) {
        achievementService.updateBookWormProgress(userId, count);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/social-reader/{userId}")
    public ResponseEntity<Void> updateSocialReaderProgress(
            @PathVariable Long userId,
            @RequestParam int count) {
        achievementService.updateSocialReaderProgress(userId, count);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/quote-master/{userId}")
    public ResponseEntity<Void> updateQuoteMasterProgress(
            @PathVariable Long userId,
            @RequestParam int count) {
        achievementService.updateQuoteMasterProgress(userId, count);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/marathon-reader/{userId}")
    public ResponseEntity<Void> updateMarathonReaderProgress(
            @PathVariable Long userId,
            @RequestParam int days) {
        achievementService.updateMarathonReaderProgress(userId, days);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/recalculate/{userId}")
    public ResponseEntity<Void> recalculateAchievements(@PathVariable Long userId) {
        achievementService.recalculateAllAchievements(userId);
        return ResponseEntity.ok().build();
    }
} 