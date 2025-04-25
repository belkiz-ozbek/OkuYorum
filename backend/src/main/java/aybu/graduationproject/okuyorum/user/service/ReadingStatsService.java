package aybu.graduationproject.okuyorum.user.service;

import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.UserBook;
import aybu.graduationproject.okuyorum.library.repository.UserBookRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReadingStatsService {
    private static final Logger logger = LoggerFactory.getLogger(ReadingStatsService.class);
    private final UserRepository userRepository;
    private final UserBookRepository userBookRepository;
    
    // Ortalama okuma hızı: dakikada 1.5 sayfa
    private static final double AVERAGE_READING_SPEED = 1.5;

    @Autowired
    public ReadingStatsService(UserRepository userRepository, UserBookRepository userBookRepository) {
        this.userRepository = userRepository;
        this.userBookRepository = userBookRepository;
    }

    @Transactional
    public void updateReadingHours(Long userId) {
        logger.info("Updating reading hours for user: {}", userId);
        
        List<UserBook> readUserBooks = userBookRepository.findByUserIdAndStatus(userId, UserBook.ReadingStatus.READ);
        logger.info("Found {} read books for user: {}", readUserBooks.size(), userId);
        
        int totalPages = readUserBooks.stream()
            .map(UserBook::getBook)
            .filter(book -> book.getPageCount() != null)
            .mapToInt(Book::getPageCount)
            .sum();
        logger.info("Total pages read: {}", totalPages);
        
        int readingHours = (int) Math.round((totalPages / AVERAGE_READING_SPEED) / 60);
        logger.info("Calculated reading hours: {}", readingHours);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        user.setReadingHours(readingHours);
        userRepository.save(user);
        logger.info("Updated reading hours for user {} to {}", userId, readingHours);
    }
} 