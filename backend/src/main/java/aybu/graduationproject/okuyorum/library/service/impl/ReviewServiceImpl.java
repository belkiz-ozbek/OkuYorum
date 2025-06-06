package aybu.graduationproject.okuyorum.library.service.impl;

import aybu.graduationproject.okuyorum.library.dto.CreateReviewRequest;
import aybu.graduationproject.okuyorum.library.dto.ReviewDTO;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.Review;
import aybu.graduationproject.okuyorum.library.entity.ReviewLike;
import aybu.graduationproject.okuyorum.library.repository.BookRepository;
import aybu.graduationproject.okuyorum.library.repository.ReviewLikeRepository;
import aybu.graduationproject.okuyorum.library.repository.ReviewRepository;
import aybu.graduationproject.okuyorum.library.service.ReviewService;
import aybu.graduationproject.okuyorum.notification.service.NotificationService;
import aybu.graduationproject.okuyorum.profile.service.AchievementService;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserService userService;
    private final ReviewLikeRepository reviewLikeRepository;
    private final NotificationService notificationService;
    private final AchievementService achievementService;

    @Autowired
    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            BookRepository bookRepository,
            UserService userService,
            ReviewLikeRepository reviewLikeRepository,
            NotificationService notificationService,
            AchievementService achievementService) {
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
        this.userService = userService;
        this.reviewLikeRepository = reviewLikeRepository;
        this.notificationService = notificationService;
        this.achievementService = achievementService;
    }

    @Override
    @Transactional
    public ReviewDTO createReview(CreateReviewRequest request) {
        // Get current user
        User currentUser = userService.getCurrentUser();

        // Get book
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + request.getBookId()));

        // Check if user already has a review for this book
        List<Review> existingReviews = reviewRepository.findByUserIdAndBookId(currentUser.getId(), book.getId());
        Review existingReview = existingReviews.isEmpty() ? null : existingReviews.get(0);

        Review review;
        if (existingReview != null) {
            if (!existingReview.isDeleted()) {
                throw new IllegalStateException("You have already reviewed this book");
            }
            // If the existing review was softly deleted, update it
            existingReview.setRating(request.getRating());
            existingReview.setContent(request.getContent());
            existingReview.setDeleted(false);
            review = existingReview;
        } else {
            // Create new review
            review = new Review();
            review.setBook(book);
            review.setUser(currentUser);
            review.setRating(request.getRating());
            review.setContent(request.getContent());
        }

        Review savedReview = reviewRepository.save(review);
        
        // Update achievement progress
        int reviewCount = reviewRepository.findByUserId(currentUser.getId()).size();
        achievementService.updateSocialReaderProgress(currentUser.getId(), reviewCount);
        
        return convertToDTO(savedReview);
    }

    @Override
    @Transactional
    public ReviewDTO updateReview(Long id, CreateReviewRequest request) {
        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
        
        // Check if the current user is the owner of the review
        User currentUser = userService.getCurrentUser();
        if (!existingReview.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You can only update your own reviews");
        }

        existingReview.setRating(request.getRating());
        existingReview.setContent(request.getContent());
        
        Review updatedReview = reviewRepository.save(existingReview);
        return convertToDTO(updatedReview);
    }

    @Override
    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));

        // Check if the current user is the owner of the review
        User currentUser = userService.getCurrentUser();
        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You can only delete your own reviews");
        }

        // Soft delete the review
        review.setDeleted(true);
        // Also clear relationships to prevent issues
        review.getComments().clear();
        review.getLikes().clear();
        reviewRepository.save(review);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewDTO getReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
        
        // Check if the review is deleted
        if (review.isDeleted()) {
            throw new EntityNotFoundException("Review not found with id: " + id);
        }
        
        return convertToDTO(review);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .filter(review -> !review.isDeleted()) // Only return non-deleted reviews
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getActiveReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .filter(review -> !review.isDeleted())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByBook(Long bookId) {
        return reviewRepository.findByBookId(bookId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getActiveReviewsByBook(Long bookId) {
        return reviewRepository.findByBookId(bookId).stream()
                .filter(review -> !review.isDeleted())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByUserAndBook(Long userId, Long bookId) {
        List<Review> reviews = reviewRepository.findByUserIdAndBookId(userId, bookId)
                .stream()
                .filter(review -> !review.isDeleted())
                .collect(Collectors.toList());
        
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewDTO toggleLike(Long reviewId) {
        // Get current user
        User currentUser = userService.getCurrentUser();
        
        // Get review
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + reviewId));
        
        // Check if user has already liked the review
        boolean hasLiked = reviewLikeRepository.existsByReviewIdAndUserId(reviewId, currentUser.getId());
        
        if (hasLiked) {
            // Unlike
            reviewLikeRepository.deleteByReviewIdAndUserId(reviewId, currentUser.getId());
        } else {
            // Like
            ReviewLike like = new ReviewLike();
            like.setReview(review);
            like.setUser(currentUser);
            reviewLikeRepository.save(like);

            // Send notification if the review is not user's own
            if (!review.getUser().getId().equals(currentUser.getId())) {
                notificationService.createNotification(
                    review.getUser().getId(),
                    currentUser.getId(),
                    "REVIEW_LIKE",
                    String.format("%s incelemenizi beğendi", currentUser.getUsername()),
                    String.format("/reviews/%d", review.getId())
                );
            }
        }

        // Commit the changes
        reviewRepository.flush();
        reviewLikeRepository.flush();
        
        // Check the current like status after the transaction
        boolean currentLikeStatus = !hasLiked; // If it was liked, now it's unliked and vice versa
        int likeCount = reviewLikeRepository.countByReviewId(reviewId);
        
        // Create DTO
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setBookId(review.getBook().getId());
        dto.setBookTitle(review.getBook().getTitle());
        dto.setBookAuthor(review.getBook().getAuthor());
        dto.setBookCoverImage(review.getBook().getImageUrl());
        dto.setUserId(review.getUser().getId());
        dto.setUsername(review.getUser().getUsername());
        dto.setUserAvatar(review.getUser().getProfileImage());
        dto.setRating(review.getRating());
        dto.setContent(review.getContent());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        dto.setLikesCount(likeCount);
        dto.setIsLiked(currentLikeStatus);
        dto.setIsSaved(false);
        
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDTO> getAllReviews(Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByIsDeletedFalse(pageable);
        return reviews.map(this::convertToDTO);
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setBookId(review.getBook().getId());
        dto.setBookTitle(review.getBook().getTitle());
        dto.setBookAuthor(review.getBook().getAuthor());
        dto.setBookCoverImage(review.getBook().getImageUrl());
        dto.setUserId(review.getUser().getId());
        dto.setUsername(review.getUser().getUsername());
        dto.setUserAvatar(review.getUser().getProfileImage());
        dto.setRating(review.getRating());
        dto.setContent(review.getContent());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        
        // Get current user
        User currentUser = userService.getCurrentUser();
        
        // Set likes count
        dto.setLikesCount(review.getLikes().size());
        
        // Set is liked
        dto.setIsLiked(review.getLikes().stream()
                .anyMatch(like -> like.getUser().getId().equals(currentUser.getId())));
        
        // Set is saved (TODO: Implement save feature)
        dto.setIsSaved(false);
        
        return dto;
    }
} 