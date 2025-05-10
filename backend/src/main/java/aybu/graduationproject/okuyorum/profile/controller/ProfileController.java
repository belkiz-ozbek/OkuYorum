package aybu.graduationproject.okuyorum.profile.controller;

import aybu.graduationproject.okuyorum.profile.entity.Achievement;
import aybu.graduationproject.okuyorum.user.entity.ReadingActivity;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.profile.service.ProfileService;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.UserBook;
import aybu.graduationproject.okuyorum.user.repository.ReadingActivityRepository;
import aybu.graduationproject.okuyorum.library.repository.UserBookRepository;
import aybu.graduationproject.okuyorum.user.service.ReadingActivityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {
    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ReadingActivityRepository readingActivityRepository;

    @Autowired
    private UserBookRepository userBookRepository;

    @Autowired
    private ReadingActivityService readingActivityService;

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
    public ResponseEntity<ReadingActivity> addReadingActivity(@RequestBody ReadingActivityRequest request) {
        logger.info("Received reading activity request: {}", request);
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        logger.debug("Processing request for user: {} ({})", user.getId(), user.getUsername());
        
        try {
            ReadingActivity result = profileService.addReadingActivity(
                user.getId(), 
                request.getBooksRead(), 
                request.getPagesRead(), 
                request.getReadingMinutes()
            );
            logger.info("Successfully added reading activity with id: {} for user: {}", result.getId(), user.getId());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error adding reading activity for user {}: {}", user.getId(), e.getMessage(), e);
            throw e;
        }
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

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserProfileById(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getUserProfile(userId));
    }

    @GetMapping("/{userId}/achievements")
    public ResponseEntity<List<Achievement>> getUserAchievementsById(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getUserAchievements(userId));
    }

    @GetMapping("/{userId}/reading-activity")
    public ResponseEntity<List<ReadingActivity>> getUserReadingActivityById(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getUserReadingActivity(userId));
    }

    @PutMapping("/yearly-goal")
    public ResponseEntity<User> updateYearlyGoal(@RequestParam Integer goal) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.updateYearlyGoal(user.getId(), goal));
    }

    @GetMapping("/{userId}/reading-stats")
    public ResponseEntity<Map<String, Object>> getUserReadingStats(@PathVariable Long userId) {
        logger.info("Fetching reading stats for user: {}", userId);
        
        try {
            // Get total books read from UserBook table
            List<UserBook> readUserBooks = userBookRepository.findByUserIdAndStatus(userId, UserBook.ReadingStatus.READ);
            int totalBooksFromStatus = readUserBooks.size();
            
            // Get stats from ReadingActivity table
            Integer totalReadingMinutes = readingActivityRepository.getTotalReadingMinutes(userId);
            Integer totalPagesRead = readingActivityRepository.getTotalPagesRead(userId);
            Integer totalBooksRead = readingActivityRepository.getTotalBooksRead(userId);
            
            // Calculate total pages from UserBook table
            int totalPages = readUserBooks.stream()
                .map(UserBook::getBook)
                .filter(book -> book.getPageCount() != null)
                .mapToInt(Book::getPageCount)
                .sum();
                
            // Use the maximum value between UserBook and ReadingActivity tables
            int finalBooksRead = Math.max(totalBooksFromStatus, totalBooksRead != null ? totalBooksRead : 0);
            int finalPages = Math.max(totalPages, totalPagesRead != null ? totalPagesRead : 0);
            
            // Calculate reading hours from both sources
            // 1. From pages: pages * 1.5 minutes per page, then convert to hours
            double readingMinutesFromPages = finalPages * 1.5;
            int readingHoursFromPages = (int) Math.round(readingMinutesFromPages / 60.0);
            
            // 2. From activity minutes
            int readingHoursFromMinutes = totalReadingMinutes != null ? (int) Math.round(totalReadingMinutes / 60.0) : 0;
            
            // Use the larger value
            int finalReadingHours = Math.max(readingHoursFromPages, readingHoursFromMinutes);
            
            // Calculate monthly average (books per month)
            LocalDateTime firstBookDateTime = readUserBooks.stream()
                .map(UserBook::getCreatedAt)
                .min(LocalDateTime::compareTo)
                .orElse(LocalDateTime.now());
                
            LocalDate firstBookDate = firstBookDateTime.toLocalDate();
            
            long monthsBetween = ChronoUnit.MONTHS.between(
                firstBookDate.withDayOfMonth(1),
                LocalDate.now().withDayOfMonth(1)
            ) + 1;
            
            double monthlyAverage = monthsBetween > 0 ? (double) finalBooksRead / monthsBetween : finalBooksRead;
            
            // Get consecutive days
            Optional<ReadingActivity> lastActivity = readingActivityRepository.findFirstByUserIdOrderByLastReadDateDesc(userId);
            int consecutiveDays = lastActivity.map(ReadingActivity::getConsecutiveDays).orElse(0);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalBooks", finalBooksRead);
            stats.put("totalPages", finalPages);
            stats.put("readingHours", finalReadingHours);
            stats.put("monthlyAverage", Math.round(monthlyAverage));
            stats.put("consecutiveDays", consecutiveDays);
            
            logger.info("Successfully fetched reading stats for user {}: {}", userId, stats);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching reading stats for user {}: {}", userId, e.getMessage(), e);
            throw e;
        }
    }

    @PutMapping("/{userId}/update-reading-activities")
    public ResponseEntity<String> updateReadingActivities(@PathVariable Long userId) {
        logger.info("Updating reading activities for user: {}", userId);
        
        try {
            readingActivityService.updateExistingReadingActivities(userId);
            return ResponseEntity.ok("Successfully updated reading activities");
        } catch (Exception e) {
            logger.error("Error updating reading activities for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(500).body("Error updating reading activities: " + e.getMessage());
        }
    }

    // Request sınıfı
    public static class ReadingActivityRequest {
        private Integer booksRead;
        private Integer pagesRead;
        private Integer readingMinutes;

        public Integer getBooksRead() {
            return booksRead;
        }

        public void setBooksRead(Integer booksRead) {
            this.booksRead = booksRead;
        }

        public Integer getPagesRead() {
            return pagesRead;
        }

        public void setPagesRead(Integer pagesRead) {
            this.pagesRead = pagesRead;
        }

        public Integer getReadingMinutes() {
            return readingMinutes;
        }

        public void setReadingMinutes(Integer readingMinutes) {
            this.readingMinutes = readingMinutes;
        }

        @Override
        public String toString() {
            return "ReadingActivityRequest{" +
                   "booksRead=" + booksRead +
                   ", pagesRead=" + pagesRead +
                   ", readingMinutes=" + readingMinutes +
                   '}';
        }
    }
} 