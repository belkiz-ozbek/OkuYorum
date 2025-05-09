package aybu.graduationproject.okuyorum.user.service;

import aybu.graduationproject.okuyorum.user.entity.ReadingActivity;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.ReadingActivityRepository;
import aybu.graduationproject.okuyorum.profile.service.AchievementService;
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
    private final ReadingActivityRepository readingActivityRepository;
    private final AchievementService achievementService;

    @Autowired
    public ReadingActivityService(
            ReadingActivityRepository readingActivityRepository,
            AchievementService achievementService) {
        this.readingActivityRepository = readingActivityRepository;
        this.achievementService = achievementService;
    }

    @Transactional
    public ReadingActivity addReadingActivity(Long userId, Integer booksRead, Integer pagesRead, Integer readingMinutes) {
        User user = new User();
        user.setId(userId);

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
        
        // Update achievements
        achievementService.updateMarathonReaderProgress(userId, activity.getConsecutiveDays());
        
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