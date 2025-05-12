package aybu.graduationproject.okuyorum.library.repository;

import aybu.graduationproject.okuyorum.library.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserId(Long userId);
    List<Review> findByBookId(Long bookId);
    List<Review> findByUserIdAndBookId(Long userId, Long bookId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.book.id = :bookId")
    Double getAverageRatingByBookId(@Param("bookId") Long bookId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.book.id = :bookId")
    Long getReviewCountByBookId(@Param("bookId") Long bookId);

    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.likes WHERE r.id = :reviewId")
    Optional<Review> findByIdWithLikes(@Param("reviewId") Long reviewId);

    Page<Review> findByIsDeletedFalse(Pageable pageable);
} 