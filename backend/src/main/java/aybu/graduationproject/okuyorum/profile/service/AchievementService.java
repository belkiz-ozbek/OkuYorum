package aybu.graduationproject.okuyorum.profile.service;

import aybu.graduationproject.okuyorum.profile.entity.Achievement;
import aybu.graduationproject.okuyorum.profile.entity.AchievementType;
import aybu.graduationproject.okuyorum.profile.repository.AchievementRepository;
import aybu.graduationproject.okuyorum.library.repository.CommentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AchievementService {

    private static final Logger log = LoggerFactory.getLogger(AchievementService.class);

    private final AchievementRepository achievementRepository;
    private final CommentRepository commentRepository;

    public AchievementService(AchievementRepository achievementRepository, CommentRepository commentRepository) {
        this.achievementRepository = achievementRepository;
        this.commentRepository = commentRepository;
    }

    public List<Achievement> getUserAchievements(Long userId) {
        log.info("Getting achievements for user: {}", userId);
        List<Achievement> achievements = achievementRepository.findByUserId(userId);
        log.info("Found {} achievements for user: {}", achievements.size(), userId);
        return achievements;
    }

    public Achievement getAchievement(Long userId, AchievementType type) {
        List<Achievement> achievements = achievementRepository.findByUserIdAndType(userId, type);
        return achievements.isEmpty() ? null : achievements.get(0);
    }

    @Transactional
    public void initializeAchievements(Long userId) {
        for (AchievementType type : AchievementType.values()) {
            if (!achievementRepository.existsByUserIdAndType(userId, type)) {
                Achievement achievement = new Achievement();
                achievement.setUserId(userId);
                achievement.setType(type);
                achievement.setEarned(false);
                achievement.setProgress(0);
                achievementRepository.save(achievement);
            }
        }
    }

    @Transactional
    public void updateBookWormProgress(Long userId, int count) {
        Achievement achievement = getOrCreateAchievement(userId, AchievementType.BOOK_WORM);
        int progress = (count * 100) / 100; // 100 kitap = %100
        updateAchievementProgress(achievement, progress);
    }

    @Transactional
    public void updateSocialReaderProgress(Long userId, int count) {
        Achievement achievement = getOrCreateAchievement(userId, AchievementType.SOCIAL_READER);
        int progress = (count * 100) / 50; // 50 yorum = %100
        updateAchievementProgress(achievement, progress);
    }

    @Transactional
    public void updateQuoteMasterProgress(Long userId, int count) {
        Achievement achievement = getOrCreateAchievement(userId, AchievementType.QUOTE_MASTER);
        int progress = (count * 100) / 200; // 200 alıntı = %100
        updateAchievementProgress(achievement, progress);
    }

    @Transactional
    public void updateMarathonReaderProgress(Long userId, int days) {
        Achievement achievement = getOrCreateAchievement(userId, AchievementType.MARATHON_READER);
        int progress = (days * 100) / 30; // 30 gün = %100
        updateAchievementProgress(achievement, progress);
    }

    @Transactional
    public void updateTotalCommentsProgress(Long userId) {
        int totalComments = commentRepository.countByUserIdAndNotDeleted(userId);
        updateSocialReaderProgress(userId, totalComments);
    }

    @Transactional
    public void recalculateAllAchievements(Long userId) {
        // Recalculate Social Reader achievement
        int totalComments = commentRepository.countByUserIdAndNotDeleted(userId);
        updateSocialReaderProgress(userId, totalComments);
        
        // We can add other achievement recalculations here in the future
        log.info("Recalculated all achievements for user ID: {}", userId);
    }

    private Achievement getOrCreateAchievement(Long userId, AchievementType type) {
        List<Achievement> achievements = achievementRepository.findByUserIdAndType(userId, type);
        if (!achievements.isEmpty()) {
            return achievements.get(0);
        } else {
            Achievement newAchievement = new Achievement();
            newAchievement.setUserId(userId);
            newAchievement.setType(type);
            newAchievement.setEarned(false);
            newAchievement.setProgress(0);
            return achievementRepository.save(newAchievement);
        }
    }

    private void updateAchievementProgress(Achievement achievement, int progress) {
        achievement.setProgress(Math.min(progress, 100));
        achievement.setEarned(progress >= 100);
        achievementRepository.save(achievement);
    }

    public boolean hasAchievement(Long userId, AchievementType type) {
        return achievementRepository.existsByUserIdAndTypeAndEarnedIsTrue(userId, type);
    }
} 