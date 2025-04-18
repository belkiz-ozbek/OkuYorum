package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.dto.CreateQuoteRequest;
import aybu.graduationproject.okuyorum.library.dto.QuoteDTO;
import aybu.graduationproject.okuyorum.library.service.QuoteService;
import aybu.graduationproject.okuyorum.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteController {
    private final QuoteService quoteService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<QuoteDTO> createQuote(
            @RequestBody CreateQuoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.findUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.createQuote(request, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuoteDTO> getQuote(@PathVariable Long id) {
        return ResponseEntity.ok(quoteService.getQuote(id));
    }

    @GetMapping("/user")
    public ResponseEntity<List<QuoteDTO>> getUserQuotes(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.findUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.getUserQuotes(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuoteDTO>> getQuotesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(quoteService.getUserQuotes(userId));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<QuoteDTO>> getBookQuotes(@PathVariable Long bookId) {
        return ResponseEntity.ok(quoteService.getBookQuotes(bookId));
    }

    @GetMapping("/user/book/{bookId}")
    public ResponseEntity<List<QuoteDTO>> getUserBookQuotes(
            @PathVariable Long bookId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.findUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.getUserBookQuotes(userId, bookId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuote(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.findUserIdByUsername(userDetails.getUsername());
        quoteService.deleteQuote(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<QuoteDTO> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.findUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.toggleLike(id, userId));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<QuoteDTO> toggleSave(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.findUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.toggleSave(id, userId));
    }

    @GetMapping("/liked")
    public ResponseEntity<List<QuoteDTO>> getLikedQuotes(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.findUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.getLikedQuotes(userId));
    }

    @GetMapping("/saved")
    public ResponseEntity<List<QuoteDTO>> getSavedQuotes(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.findUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.getSavedQuotes(userId));
    }
} 