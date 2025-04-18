package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.BookFeedbackDTO;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.BookFeedback;
import aybu.graduationproject.okuyorum.library.repository.BookFeedbackRepository;
import aybu.graduationproject.okuyorum.library.repository.BookRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookFeedbackService {
    private final BookFeedbackRepository bookFeedbackRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookFeedbackDTO addFeedback(Long bookId, Long userId, Integer rating, String comment) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Kitap bulunamadı"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Puan 1 ile 5 arasında olmalıdır");
        }

        BookFeedback feedback = new BookFeedback();
        feedback.setBook(book);
        feedback.setUser(user);
        feedback.setRating(rating);
        feedback.setComment(comment);

        return convertToDTO(bookFeedbackRepository.save(feedback));
    }

    public List<BookFeedbackDTO> getBookFeedbacks(Long bookId) {
        return bookFeedbackRepository.findByBookId(bookId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookFeedbackDTO> getUserFeedbacks(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return bookFeedbackRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public double getAverageRating(Long bookId) {
        List<BookFeedback> feedbacks = bookFeedbackRepository.findByBookId(bookId);
        if (feedbacks.isEmpty()) {
            return 0.0;
        }
        return feedbacks.stream()
                .mapToInt(BookFeedback::getRating)
                .average()
                .orElse(0.0);
    }

    private BookFeedbackDTO convertToDTO(BookFeedback feedback) {
        BookFeedbackDTO dto = new BookFeedbackDTO();
        dto.setId(feedback.getId());
        dto.setBookId(feedback.getBook().getId());
        dto.setUserId(feedback.getUser().getId());
        dto.setRating(feedback.getRating());
        dto.setComment(feedback.getComment());
        dto.setCreatedAt(feedback.getCreatedAt());
        dto.setUpdatedAt(feedback.getUpdatedAt());
        return dto;
    }
} 