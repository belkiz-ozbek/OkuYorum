package aybu.graduationproject.okuyorum.library.repository;

import aybu.graduationproject.okuyorum.library.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByQuoteIdAndParentCommentIsNullAndDeletedFalseOrderByCreatedAtDesc(Long quoteId);
    List<Comment> findByReviewIdAndParentCommentIsNullAndDeletedFalseOrderByCreatedAtDesc(Long reviewId);
    List<Comment> findByPostIdAndParentCommentIsNullAndDeletedFalseOrderByCreatedAtDesc(Long postId);
    List<Comment> findByParentCommentIdAndDeletedFalse(Long parentCommentId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.user.id = :userId AND c.deleted = false " +
           "AND ((c.quote IS NOT NULL) OR (c.review IS NOT NULL) OR (c.post IS NOT NULL))")
    int countByUserIdAndNotDeleted(@Param("userId") Long userId);
} 