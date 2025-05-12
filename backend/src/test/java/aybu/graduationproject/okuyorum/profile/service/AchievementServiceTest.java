package aybu.graduationproject.okuyorum.profile.service;

import aybu.graduationproject.okuyorum.profile.entity.Achievement;
import aybu.graduationproject.okuyorum.profile.entity.AchievementType;
import aybu.graduationproject.okuyorum.profile.repository.AchievementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AchievementServiceTest {

    @Mock
    private AchievementRepository achievementRepository;

    @InjectMocks
    private AchievementService achievementService;

    private Achievement existingAchievement;
    private Long userId;

    @BeforeEach
    void setUp() {
        userId = 1L;
        existingAchievement = new Achievement();
        existingAchievement.setId(1L);
        existingAchievement.setUserId(userId);
        existingAchievement.setType(AchievementType.BOOK_WORM);
        existingAchievement.setEarned(false);
        existingAchievement.setProgress(0);
    }

    @Test
    void updateBookWormProgress_WhenProgressReaches100_ShouldEarnAchievement() {
        // Arrange
        when(achievementRepository.findByUserIdAndType(userId, AchievementType.BOOK_WORM))
                .thenReturn(Collections.singletonList(existingAchievement));
        when(achievementRepository.save(any(Achievement.class)))
                .thenReturn(existingAchievement);

        // Act
        achievementService.updateBookWormProgress(userId, 10);

        // Assert
        verify(achievementRepository).save(any(Achievement.class));
        assertTrue(existingAchievement.isEarned());
        assertEquals(100, existingAchievement.getProgress());
    }

    @Test
    void updateSocialReaderProgress_WhenProgressReaches100_ShouldEarnAchievement() {
        // Arrange
        when(achievementRepository.findByUserIdAndType(userId, AchievementType.SOCIAL_READER))
                .thenReturn(Collections.singletonList(existingAchievement));
        when(achievementRepository.save(any(Achievement.class)))
                .thenReturn(existingAchievement);

        // Act
        achievementService.updateSocialReaderProgress(userId, 5);

        // Assert
        verify(achievementRepository).save(any(Achievement.class));
        assertTrue(existingAchievement.isEarned());
        assertEquals(100, existingAchievement.getProgress());
    }

    @Test
    void updateQuoteMasterProgress_WhenProgressReaches100_ShouldEarnAchievement() {
        // Arrange
        when(achievementRepository.findByUserIdAndType(userId, AchievementType.QUOTE_MASTER))
                .thenReturn(Collections.singletonList(existingAchievement));
        when(achievementRepository.save(any(Achievement.class)))
                .thenReturn(existingAchievement);

        // Act
        achievementService.updateQuoteMasterProgress(userId, 3);

        // Assert
        verify(achievementRepository).save(any(Achievement.class));
        assertTrue(existingAchievement.isEarned());
        assertEquals(100, existingAchievement.getProgress());
    }

    @Test
    void updateMarathonReaderProgress_WhenProgressReaches100_ShouldEarnAchievement() {
        // Arrange
        when(achievementRepository.findByUserIdAndType(userId, AchievementType.MARATHON_READER))
                .thenReturn(Collections.singletonList(existingAchievement));
        when(achievementRepository.save(any(Achievement.class)))
                .thenReturn(existingAchievement);

        // Act
        achievementService.updateMarathonReaderProgress(userId, 7);

        // Assert
        verify(achievementRepository).save(any(Achievement.class));
        assertTrue(existingAchievement.isEarned());
        assertEquals(100, existingAchievement.getProgress());
    }

    @Test
    void updateProgress_WhenAchievementNotFound_ShouldCreateNewAchievement() {
        // Arrange
        when(achievementRepository.findByUserIdAndType(userId, AchievementType.BOOK_WORM))
                .thenReturn(Collections.emptyList());
        when(achievementRepository.save(any(Achievement.class)))
                .thenReturn(existingAchievement);

        // Act
        achievementService.updateBookWormProgress(userId, 5);

        // Assert
        verify(achievementRepository, times(2)).save(any(Achievement.class));
        assertFalse(existingAchievement.isEarned());
        assertEquals(50, existingAchievement.getProgress());
    }

    @Test
    void updateProgress_WhenProgressDoesNotReach100_ShouldNotEarnAchievement() {
        // Arrange
        when(achievementRepository.findByUserIdAndType(userId, AchievementType.BOOK_WORM))
                .thenReturn(Collections.singletonList(existingAchievement));
        when(achievementRepository.save(any(Achievement.class)))
                .thenReturn(existingAchievement);

        // Act
        achievementService.updateBookWormProgress(userId, 5);

        // Assert
        verify(achievementRepository).save(any(Achievement.class));
        assertFalse(existingAchievement.isEarned());
        assertEquals(50, existingAchievement.getProgress());
    }
} 