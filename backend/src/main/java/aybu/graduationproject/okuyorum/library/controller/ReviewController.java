package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.dto.CreateReviewRequest;
import aybu.graduationproject.okuyorum.library.dto.ReviewDTO;
import aybu.graduationproject.okuyorum.library.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReviewDTO> toggleLike(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.toggleLike(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReview(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<ReviewDTO>> getActiveReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getActiveReviewsByUser(userId));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(reviewService.getReviewsByBook(bookId));
    }

    @GetMapping("/book/{bookId}/active")
    public ResponseEntity<List<ReviewDTO>> getActiveReviewsByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(reviewService.getActiveReviewsByBook(bookId));
    }

    @GetMapping("/user/{userId}/book/{bookId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUserAndBook(
            @PathVariable Long userId,
            @PathVariable Long bookId) {
        return ResponseEntity.ok(reviewService.getReviewsByUserAndBook(userId, bookId));
    }
} 