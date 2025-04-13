package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.entity.Review;
import aybu.graduationproject.okuyorum.library.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public Review updateReview(Long id, Review review) {
        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        existingReview.setRating(review.getRating());
        existingReview.setContent(review.getContent());
        
        return reviewRepository.save(existingReview);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public Review getReview(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    public List<Review> getReviewsByBook(Long bookId) {
        return reviewRepository.findByBookId(bookId);
    }

    public List<Review> getReviewsByUserAndBook(Long userId, Long bookId) {
        return reviewRepository.findByUserIdAndBookId(userId, bookId);
    }
} 