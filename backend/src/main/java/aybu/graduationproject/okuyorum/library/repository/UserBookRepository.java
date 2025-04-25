package aybu.graduationproject.okuyorum.library.repository;

import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.UserBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBookRepository extends JpaRepository<UserBook, Long> {
    List<UserBook> findByUserId(Long userId);
    List<UserBook> findByBookId(Long bookId);
    Optional<UserBook> findByUserIdAndBookId(Long userId, Long bookId);
    List<UserBook> findByUserIdAndStatus(Long userId, UserBook.ReadingStatus status);
    List<UserBook> findByBookIdAndStatus(Long bookId, UserBook.ReadingStatus status);
    List<UserBook> findByUserIdAndIsFavoriteTrue(Long userId);
    int countByUserIdAndStatus(Long userId, UserBook.ReadingStatus status);
} 