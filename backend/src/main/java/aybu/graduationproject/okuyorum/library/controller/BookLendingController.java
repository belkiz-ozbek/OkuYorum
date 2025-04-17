package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.entity.BookLending;
import aybu.graduationproject.okuyorum.library.service.BookLendingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/book-lendings")
@RequiredArgsConstructor
public class BookLendingController {
    private final BookLendingService bookLendingService;

    @PostMapping("/lend")
    public ResponseEntity<BookLending> lendBook(
            @RequestParam Long bookId,
            @RequestParam Long borrowerId) {
        return ResponseEntity.ok(bookLendingService.lendBook(bookId, borrowerId));
    }

    @PostMapping("/{lendingId}/return")
    public ResponseEntity<BookLending> returnBook(
            @PathVariable Long lendingId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String feedback) {
        return ResponseEntity.ok(bookLendingService.returnBook(lendingId, rating, feedback));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookLending>> getUserBorrowedBooks(@PathVariable Long userId) {
        return ResponseEntity.ok(bookLendingService.getBorrowedBooksByUser(userId));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BookLending>> getBookLendingHistory(@PathVariable Long bookId) {
        return ResponseEntity.ok(bookLendingService.getLendingHistoryForBook(bookId));
    }
} 