package aybu.graduationproject.okuyorum.library.repository;

import aybu.graduationproject.okuyorum.library.entity.BookLending;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookLendingRepository extends JpaRepository<BookLending, Long> {
    List<BookLending> findByBorrowerId(Long borrowerId);
    List<BookLending> findByBookId(Long bookId);
    boolean existsByBookIdAndStatus(Long bookId, BookLending.LendingStatus status);
    List<BookLending> findByBorrowerIdAndStatus(Long borrowerId, BookLending.LendingStatus status);
    List<BookLending> findByBookIdOrderByLendDateDesc(Long bookId);
    List<BookLending> findByStatusAndDueDateBefore(BookLending.LendingStatus status, LocalDateTime dateTime);
}