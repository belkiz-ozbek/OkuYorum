package aybu.graduationproject.okuyorum.library.repository;

import aybu.graduationproject.okuyorum.library.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findByUserId(Long userId);
    List<Quote> findByBookId(Long bookId);
    List<Quote> findByUserIdAndBookId(Long userId, Long bookId);
} 