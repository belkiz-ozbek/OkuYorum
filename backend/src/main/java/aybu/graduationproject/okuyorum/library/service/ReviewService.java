package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.CreateReviewRequest;
import aybu.graduationproject.okuyorum.library.dto.ReviewDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewService {
    ReviewDTO createReview(CreateReviewRequest request);
    ReviewDTO updateReview(Long id, CreateReviewRequest request);
    void deleteReview(Long id);
    ReviewDTO getReview(Long id);
    List<ReviewDTO> getReviewsByUser(Long userId);
    List<ReviewDTO> getActiveReviewsByUser(Long userId);
    List<ReviewDTO> getReviewsByBook(Long bookId);
    List<ReviewDTO> getActiveReviewsByBook(Long bookId);
    List<ReviewDTO> getReviewsByUserAndBook(Long userId, Long bookId);
    ReviewDTO toggleLike(Long reviewId);
    Page<ReviewDTO> getAllReviews(Pageable pageable);
} 