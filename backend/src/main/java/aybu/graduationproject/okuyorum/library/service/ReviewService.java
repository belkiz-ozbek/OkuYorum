package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.CreateReviewRequest;
import aybu.graduationproject.okuyorum.library.dto.ReviewDTO;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.Review;
import aybu.graduationproject.okuyorum.library.repository.BookRepository;
import aybu.graduationproject.okuyorum.library.repository.ReviewRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserService userService;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, BookRepository bookRepository, UserService userService) {
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
        this.userService = userService;
    }

    @Transactional
    public ReviewDTO createReview(CreateReviewRequest request) {
        // Get current user
        User currentUser = userService.getCurrentUser();

        // Get book
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + request.getBookId()));

        // Check if user already has a review for this book
        Review existingReview = reviewRepository.findByUserIdAndBookId(currentUser.getId(), book.getId())
                .orElse(null);

        Review review;
        if (existingReview != null) {
            if (!existingReview.isDeleted()) {
                throw new IllegalStateException("You have already reviewed this book");
            }
            // If the existing review was soft deleted, update it
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
        return convertToDTO(savedReview);
    }

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

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));

        // Check if the current user is the owner of the review
        User currentUser = userService.getCurrentUser();
        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You can only delete your own reviews");
        }

        // Soft delete the review instead of hard delete
        review.setDeleted(true);
        reviewRepository.save(review);
    }

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

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getActiveReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .filter(review -> !review.isDeleted())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByBook(Long bookId) {
        return reviewRepository.findByBookId(bookId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getActiveReviewsByBook(Long bookId) {
        return reviewRepository.findByBookId(bookId).stream()
                .filter(review -> !review.isDeleted())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByUserAndBook(Long userId, Long bookId) {
        return reviewRepository.findByUserIdAndBookId(userId, bookId)
                .map(review -> {
                    List<ReviewDTO> reviews = new ArrayList<>();
                    reviews.add(convertToDTO(review));
                    return reviews;
                })
                .orElse(Collections.emptyList());
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
        // These fields might need to be populated from other services
        dto.setLikesCount(0); // TODO: Implement likes count
        dto.setIsLiked(false); // TODO: Implement is liked check
        dto.setIsSaved(false); // TODO: Implement is saved check
        return dto;
    }
} 