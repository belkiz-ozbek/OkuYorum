package aybu.graduationproject.okuyorum.library.repository;

import aybu.graduationproject.okuyorum.library.entity.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    boolean existsByCommentIdAndUserId(Long commentId, Long userId);
    
    @Transactional
    void deleteByCommentIdAndUserId(Long commentId, Long userId);
} 