package aybu.graduationproject.okuyorum.user.service;

import aybu.graduationproject.okuyorum.user.entity.ReadingActivity;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.ReadingActivityRepository;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import aybu.graduationproject.okuyorum.profile.service.AchievementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReadingActivityService {
    private static final Logger logger = LoggerFactory.getLogger(ReadingActivityService.class);
    private final ReadingActivityRepository readingActivityRepository;
    private final UserRepository userRepository;
    private final AchievementService achievementService;

    @Autowired
    public ReadingActivityService(
            ReadingActivityRepository readingActivityRepository,
            UserRepository userRepository,
            AchievementService achievementService) {
        this.readingActivityRepository = readingActivityRepository;
        this.userRepository = userRepository;
        this.achievementService = achievementService;
    }

    @Transactional
    public ReadingActivity addReadingActivity(Long userId, Integer booksRead, Integer pagesRead, Integer readingMinutes) {
        logger.info("Adding reading activity for user {} with {} books, {} pages, {} minutes", 
                   userId, booksRead, pagesRead, readingMinutes);
                   
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        LocalDate today = LocalDate.now();
        
        ReadingActivity activity = new ReadingActivity();
        activity.setUser(user);
        activity.setActivityDate(today);
        activity.setBooksRead(booksRead);
        activity.setPagesRead(pagesRead);
        activity.setReadingMinutes(readingMinutes);

        // Update consecutive days
        Optional<ReadingActivity> lastActivity = readingActivityRepository.findFirstByUserIdOrderByLastReadDateDesc(userId);
        
        if (lastActivity.isPresent()) {
            ReadingActivity last = lastActivity.get();
            LocalDate lastReadDate = last.getLastReadDate();
            
            logger.debug("Last activity found with date {} and consecutive days {}", 
                        lastReadDate, last.getConsecutiveDays());
            
            if (lastReadDate.plusDays(1).equals(today)) {
                // Consecutive day
                activity.setConsecutiveDays(last.getConsecutiveDays() + 1);
                logger.debug("Consecutive day, new streak: {}", activity.getConsecutiveDays());
            } else if (!lastReadDate.equals(today)) {
                // Not consecutive, reset counter
                activity.setConsecutiveDays(1);
                logger.debug("Not consecutive, resetting streak to 1");
            } else {
                // Same day, keep the same count
                activity.setConsecutiveDays(last.getConsecutiveDays());
                logger.debug("Same day, keeping streak at {}", activity.getConsecutiveDays());
            }
        } else {
            // First reading activity
            activity.setConsecutiveDays(1);
            logger.debug("First activity for user, setting streak to 1");
        }
        
        activity.setLastReadDate(today);
        ReadingActivity savedActivity = readingActivityRepository.save(activity);
        logger.info("Saved reading activity with id {}", savedActivity.getId());
        
        // Update achievements
        achievementService.updateMarathonReaderProgress(userId, activity.getConsecutiveDays());
        logger.debug("Updated marathon reader progress");
        
        return savedActivity;
    }

    public List<ReadingActivity> getUserReadingActivity(Long userId) {
        return readingActivityRepository.findByUserIdOrderByActivityDateDesc(userId);
    }

    public Map<YearMonth, ReadingActivitySummary> getMonthlyReadingStats(Long userId) {
        List<ReadingActivity> activities = getUserReadingActivity(userId);
        
        return activities.stream()
            .collect(Collectors.groupingBy(
                activity -> YearMonth.from(activity.getActivityDate()),
                Collectors.collectingAndThen(
                    Collectors.toList(),
                    list -> new ReadingActivitySummary(
                        list.stream().mapToInt(ReadingActivity::getBooksRead).sum(),
                        list.stream().mapToInt(ReadingActivity::getPagesRead).sum(),
                        list.stream().mapToInt(ReadingActivity::getReadingMinutes).sum()
                    )
                )
            ));
    }

    @Transactional
    public void updateExistingReadingActivities(Long userId) {
        logger.info("Updating existing reading activities for user: {}", userId);
        
        List<ReadingActivity> activities = readingActivityRepository.findByUserIdOrderByActivityDateDesc(userId);
        
        for (ReadingActivity activity : activities) {
            // Update reading minutes based on pages read (1.5 minutes per page)
            if (activity.getPagesRead() != null && activity.getPagesRead() > 0) {
                int correctReadingMinutes = (int) Math.round(activity.getPagesRead() * 1.5);
                
                // Only update if there's a difference
                if (activity.getReadingMinutes() == null || 
                    Math.abs(activity.getReadingMinutes() - correctReadingMinutes) > 1) {
                    logger.info("Updating activity ID {}: pages={}, old minutes={}, new minutes={}", 
                               activity.getId(), activity.getPagesRead(), 
                               activity.getReadingMinutes(), correctReadingMinutes);
                    
                    activity.setReadingMinutes(correctReadingMinutes);
                    readingActivityRepository.save(activity);
                }
            }
        }
        
        logger.info("Finished updating {} reading activities for user {}", activities.size(), userId);
    }

    public static class ReadingActivitySummary {
        private final int totalBooks;
        private final int totalPages;
        private final int totalMinutes;

        public ReadingActivitySummary(int totalBooks, int totalPages, int totalMinutes) {
            this.totalBooks = totalBooks;
            this.totalPages = totalPages;
            this.totalMinutes = totalMinutes;
        }

        public int getTotalBooks() {
            return totalBooks;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public int getTotalMinutes() {
            return totalMinutes;
        }
    }
} 