package aybu.graduationproject.okuyorum.user.service;

import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.UserBook;
import aybu.graduationproject.okuyorum.library.repository.UserBookRepository;
import aybu.graduationproject.okuyorum.user.entity.ReadingActivity;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.ReadingActivityRepository;
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
    
    // Average reading speed: 1.5 minutes per page (not pages per minute)
    private static final double AVERAGE_READING_SPEED = 1.5;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserBookRepository userBookRepository;

    @Autowired
    private ReadingActivityRepository readingActivityRepository;

    @Transactional
    public void updateAllStats(Long userId) {
        logger.info("Updating all reading stats for user: {}", userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // Kitap durumuna göre istatistikler
        List<UserBook> readUserBooks = userBookRepository.findByUserIdAndStatus(userId, UserBook.ReadingStatus.READ);
        int totalBooksFromStatus = readUserBooks.size();
        
        // ReadingActivity tablosundan istatistikler
        Integer totalReadingMinutes = readingActivityRepository.getTotalReadingMinutes(userId);
        Integer totalPagesRead = readingActivityRepository.getTotalPagesRead(userId);
        Integer totalBooksRead = readingActivityRepository.getTotalBooksRead(userId);
        
        // Sayfa sayısından okuma saati hesaplama
        int totalPages = readUserBooks.stream()
            .map(UserBook::getBook)
            .filter(book -> book.getPageCount() != null)
            .mapToInt(Book::getPageCount)
            .sum();
            
        // Hem kitap durumundan hem de aktivitelerden gelen toplam kitap sayısını kullan
        int finalBooksRead = Math.max(totalBooksFromStatus, totalBooksRead != null ? totalBooksRead : 0);
        
        // Okuma saatlerini sayfa sayısından hesapla (dakikada 1.5 sayfa değil, bir sayfa 1.5 dakika)
        double readingMinutesFromPages = totalPages * AVERAGE_READING_SPEED;
        int readingHoursFromPages = (int) Math.round(readingMinutesFromPages / 60.0);
        
        // Aktivitelerden gelen okuma dakikalarını saate çevir
        int readingHoursFromMinutes = totalReadingMinutes != null ? (int) Math.round(totalReadingMinutes / 60.0) : 0;
        
        // İki hesaplamadan büyük olanı kullan
        int finalReadingHours = Math.max(readingHoursFromPages, readingHoursFromMinutes);

        // Kullanıcı istatistiklerini güncelle
        user.setReadingHours(finalReadingHours);
        user.setBooksRead(finalBooksRead);
        user.setPagesRead(totalPagesRead != null ? totalPagesRead : totalPages);
        
        // Okuyucu puanını hesapla
        int readerScore = calculateReaderScore(finalBooksRead, finalReadingHours);
        user.setReaderScore(readerScore);
        
        userRepository.save(user);
        logger.info("Updated reading stats for user {} - Books: {}, Hours: {}, Score: {}", 
                   userId, finalBooksRead, finalReadingHours, readerScore);
    }
    
    private int calculateReaderScore(int booksRead, int readingHours) {
        // Basit bir puan hesaplama formülü
        // Her kitap 10 puan, her saat 1 puan
        return (booksRead * 10) + readingHours;
    }
} 