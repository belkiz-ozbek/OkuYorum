package aybu.graduationproject.okuyorum.library.repository;

import aybu.graduationproject.okuyorum.library.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByQuoteIdOrderByCreatedAtDesc(Long quoteId);
    List<Comment> findByUserIdOrderByCreatedAtDesc(Long userId);
} 