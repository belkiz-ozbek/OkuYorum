package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.dto.BookFeedbackDTO;
import aybu.graduationproject.okuyorum.library.service.BookFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class BookFeedbackController {
    private final BookFeedbackService bookFeedbackService;

    @PostMapping
    public ResponseEntity<BookFeedbackDTO> addFeedback(
            @RequestParam Long bookId,
            @RequestParam Long userId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment) {
        return ResponseEntity.ok(bookFeedbackService.addFeedback(bookId, userId, rating, comment));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BookFeedbackDTO>> getBookFeedbacks(@PathVariable Long bookId) {
        return ResponseEntity.ok(bookFeedbackService.getBookFeedbacks(bookId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookFeedbackDTO>> getUserFeedbacks(@PathVariable Long userId) {
        return ResponseEntity.ok(bookFeedbackService.getUserFeedbacks(userId));
    }

    @GetMapping("/book/{bookId}/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long bookId) {
        return ResponseEntity.ok(bookFeedbackService.getAverageRating(bookId));
    }
} 