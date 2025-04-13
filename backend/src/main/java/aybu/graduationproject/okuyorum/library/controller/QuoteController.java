package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.entity.Quote;
import aybu.graduationproject.okuyorum.library.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {
    private final QuoteService quoteService;

    @Autowired
    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @PostMapping
    public ResponseEntity<Quote> createQuote(@RequestBody Quote quote) {
        return ResponseEntity.ok(quoteService.createQuote(quote));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quote> updateQuote(@PathVariable Long id, @RequestBody Quote quote) {
        return ResponseEntity.ok(quoteService.updateQuote(id, quote));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuote(@PathVariable Long id) {
        quoteService.deleteQuote(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quote> getQuote(@PathVariable Long id) {
        return ResponseEntity.ok(quoteService.getQuote(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Quote>> getQuotesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(quoteService.getQuotesByUser(userId));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Quote>> getQuotesByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(quoteService.getQuotesByBook(bookId));
    }

    @GetMapping("/user/{userId}/book/{bookId}")
    public ResponseEntity<List<Quote>> getQuotesByUserAndBook(
            @PathVariable Long userId,
            @PathVariable Long bookId) {
        return ResponseEntity.ok(quoteService.getQuotesByUserAndBook(userId, bookId));
    }
} 