package aybu.graduationproject.okuyorum.library.repository;

import aybu.graduationproject.okuyorum.library.entity.BookFeedback;
import aybu.graduationproject.okuyorum.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookFeedbackRepository extends JpaRepository<BookFeedback, Long> {
    List<BookFeedback> findByBookId(Long bookId);
    List<BookFeedback> findByUser(User user);
    List<BookFeedback> findByBookIdAndRating(Long bookId, Integer rating);
} 