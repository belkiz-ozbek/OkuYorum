package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.BookLending;
import aybu.graduationproject.okuyorum.library.repository.BookLendingRepository;
import aybu.graduationproject.okuyorum.library.repository.BookRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookLendingService {
    private final BookLendingRepository bookLendingRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookLending lendBook(Long bookId, Long borrowerId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        
        User borrower = userRepository.findById(borrowerId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + borrowerId));

        // Check if book is already borrowed
        if (bookLendingRepository.existsByBookIdAndStatus(bookId, BookLending.LendingStatus.BORROWED)) {
            throw new IllegalStateException("Book is already borrowed");
        }

        BookLending lending = new BookLending();
        lending.setBook(book);
        lending.setBorrower(borrower);
        lending.setLendDate(LocalDateTime.now());
        lending.setDueDate(LocalDateTime.now().plusDays(14)); // 2 weeks lending period
        lending.setStatus(BookLending.LendingStatus.BORROWED);

        return bookLendingRepository.save(lending);
    }

    @Transactional
    public BookLending returnBook(Long lendingId, Integer rating, String feedback) {
        BookLending lending = bookLendingRepository.findById(lendingId)
                .orElseThrow(() -> new EntityNotFoundException("Lending record not found with id: " + lendingId));

        if (lending.getStatus() != BookLending.LendingStatus.BORROWED) {
            throw new IllegalStateException("Book is not in borrowed state");
        }

        lending.setReturnDate(LocalDateTime.now());
        lending.setStatus(BookLending.LendingStatus.RETURNED);
        lending.setRating(rating);
        lending.setFeedback(feedback);

        return bookLendingRepository.save(lending);
    }

    public List<BookLending> getBorrowedBooksByUser(Long userId) {
        return bookLendingRepository.findByBorrowerIdAndStatus(userId, BookLending.LendingStatus.BORROWED);
    }

    public List<BookLending> getLendingHistoryForBook(Long bookId) {
        return bookLendingRepository.findByBookIdOrderByLendDateDesc(bookId);
    }

    @Transactional
    public void checkAndUpdateOverdueBooks() {
        LocalDateTime now = LocalDateTime.now();
        List<BookLending> overdueLendings = bookLendingRepository.findByStatusAndDueDateBefore(
                BookLending.LendingStatus.BORROWED, now);
        
        overdueLendings.forEach(lending -> {
            lending.setStatus(BookLending.LendingStatus.OVERDUE);
        });
        
        if (!overdueLendings.isEmpty()) {
            bookLendingRepository.saveAll(overdueLendings);
        }
    }
}