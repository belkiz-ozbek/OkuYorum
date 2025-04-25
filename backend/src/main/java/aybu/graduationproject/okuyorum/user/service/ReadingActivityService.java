package aybu.graduationproject.okuyorum.user.service;

import aybu.graduationproject.okuyorum.user.entity.ReadingActivity;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.ReadingActivityRepository;
import aybu.graduationproject.okuyorum.profile.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class ReadingActivityService {
    private final ReadingActivityRepository readingActivityRepository;
    private final AchievementService achievementService;

    @Autowired
    public ReadingActivityService(ReadingActivityRepository readingActivityRepository,
                                AchievementService achievementService) {
        this.readingActivityRepository = readingActivityRepository;
        this.achievementService = achievementService;
    }

    @Transactional
    public ReadingActivity addReadingActivity(Long userId, String month, Integer books) {
        User user = new User();
        user.setId(userId);

        ReadingActivity activity = new ReadingActivity();
        activity.setUser(user);
        activity.setMonth(month);
        activity.setBooks(books);

        // Update consecutive days
        LocalDate today = LocalDate.now();
        Optional<ReadingActivity> lastActivity = readingActivityRepository.findFirstByUserIdOrderByLastReadDateDesc(userId);
        
        if (lastActivity.isPresent()) {
            ReadingActivity last = lastActivity.get();
            LocalDate lastReadDate = last.getLastReadDate();
            
            if (lastReadDate.plusDays(1).equals(today)) {
                // Consecutive day
                activity.setConsecutiveDays(last.getConsecutiveDays() + 1);
            } else if (!lastReadDate.equals(today)) {
                // Not consecutive, reset counter
                activity.setConsecutiveDays(1);
            } else {
                // Same day, keep the same count
                activity.setConsecutiveDays(last.getConsecutiveDays());
            }
        } else {
            // First reading activity
            activity.setConsecutiveDays(1);
        }
        
        activity.setLastReadDate(today);
        ReadingActivity savedActivity = readingActivityRepository.save(activity);
        
        // Update marathon reader achievement
        achievementService.updateMarathonReaderProgress(userId, activity.getConsecutiveDays());
        
        return savedActivity;
    }

    public List<ReadingActivity> getUserReadingActivity(Long userId) {
        return readingActivityRepository.findByUserIdOrderByMonthDesc(userId);
    }
} 