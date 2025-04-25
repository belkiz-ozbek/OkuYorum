package aybu.graduationproject.okuyorum.profile.controller;

import aybu.graduationproject.okuyorum.profile.entity.Achievement;
import aybu.graduationproject.okuyorum.profile.entity.AchievementType;
import aybu.graduationproject.okuyorum.profile.service.AchievementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AchievementControllerTest {

    @Mock
    private AchievementService achievementService;

    @InjectMocks
    private AchievementController achievementController;

    private Achievement achievement;
    private Long userId;

    @BeforeEach
    void setUp() {
        userId = 1L;
        achievement = new Achievement();
        achievement.setId(1L);
        achievement.setUserId(userId);
        achievement.setType(AchievementType.BOOK_WORM);
        achievement.setEarned(true);
        achievement.setProgress(100);
    }

    @Test
    void getUserAchievements_ShouldReturnListOfAchievements() {
        // Arrange
        List<Achievement> achievements = Arrays.asList(achievement);
        when(achievementService.getUserAchievements(userId)).thenReturn(achievements);

        // Act
        ResponseEntity<List<Achievement>> response = achievementController.getUserAchievements(userId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(achievements, response.getBody());
        verify(achievementService).getUserAchievements(userId);
    }

    @Test
    void getAchievement_ShouldReturnAchievement() {
        // Arrange
        when(achievementService.getAchievement(userId, AchievementType.BOOK_WORM))
                .thenReturn(achievement);

        // Act
        ResponseEntity<Achievement> response = achievementController.getAchievement(userId, AchievementType.BOOK_WORM);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(achievement, response.getBody());
        verify(achievementService).getAchievement(userId, AchievementType.BOOK_WORM);
    }

    @Test
    void getAchievement_WhenNotFound_ShouldReturnNotFound() {
        // Arrange
        when(achievementService.getAchievement(userId, AchievementType.BOOK_WORM))
                .thenReturn(null);

        // Act
        ResponseEntity<Achievement> response = achievementController.getAchievement(userId, AchievementType.BOOK_WORM);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(achievementService).getAchievement(userId, AchievementType.BOOK_WORM);
    }

    @Test
    void updateBookWormProgress_ShouldCallService() {
        // Arrange
        int count = 5;

        // Act
        ResponseEntity<Void> response = achievementController.updateBookWormProgress(userId, count);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(achievementService).updateBookWormProgress(userId, count);
    }

    @Test
    void updateSocialReaderProgress_ShouldCallService() {
        // Arrange
        int count = 3;

        // Act
        ResponseEntity<Void> response = achievementController.updateSocialReaderProgress(userId, count);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(achievementService).updateSocialReaderProgress(userId, count);
    }

    @Test
    void updateQuoteMasterProgress_ShouldCallService() {
        // Arrange
        int count = 2;

        // Act
        ResponseEntity<Void> response = achievementController.updateQuoteMasterProgress(userId, count);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(achievementService).updateQuoteMasterProgress(userId, count);
    }

    @Test
    void updateMarathonReaderProgress_ShouldCallService() {
        // Arrange
        int days = 5;

        // Act
        ResponseEntity<Void> response = achievementController.updateMarathonReaderProgress(userId, days);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(achievementService).updateMarathonReaderProgress(userId, days);
    }
} 