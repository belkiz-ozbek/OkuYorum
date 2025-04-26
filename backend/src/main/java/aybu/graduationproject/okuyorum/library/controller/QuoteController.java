package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.dto.CreateQuoteRequest;
import aybu.graduationproject.okuyorum.library.dto.QuoteDTO;
import aybu.graduationproject.okuyorum.library.service.QuoteService;
import aybu.graduationproject.okuyorum.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.createQuote(request, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuoteDTO> getQuote(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userDetails != null ? userService.getUserIdByUsername(userDetails.getUsername()) : null;
        return ResponseEntity.ok(quoteService.getQuote(id, userId));
    }

    @GetMapping("/user")
    public ResponseEntity<List<QuoteDTO>> getUserQuotes(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.getUserQuotes(userId, userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuoteDTO>> getQuotesByUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = userDetails != null ? userService.getUserIdByUsername(userDetails.getUsername()) : null;
        return ResponseEntity.ok(quoteService.getUserQuotes(userId, currentUserId));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<QuoteDTO>> getBookQuotes(
            @PathVariable Long bookId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userDetails != null ? userService.getUserIdByUsername(userDetails.getUsername()) : null;
        return ResponseEntity.ok(quoteService.getBookQuotes(bookId, userId));
    }

    @GetMapping("/user/book/{bookId}")
    public ResponseEntity<List<QuoteDTO>> getUserBookQuotes(
            @PathVariable Long bookId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.getUserBookQuotes(userId, bookId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuote(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        quoteService.deleteQuote(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<QuoteDTO> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.toggleLike(id, userId));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<QuoteDTO> toggleSave(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.toggleSave(id, userId));
    }

    @GetMapping("/liked")
    public ResponseEntity<List<QuoteDTO>> getLikedQuotes(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.getLikedQuotes(userId));
    }

    @GetMapping("/saved")
    public ResponseEntity<List<QuoteDTO>> getSavedQuotes(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.getSavedQuotes(userId));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<QuoteDTO> updateQuote(
            @PathVariable Long id,
            @RequestBody CreateQuoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(quoteService.updateQuote(id, request, userId));
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<String> shareQuote(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        String shareUrl = quoteService.shareQuote(id, userId);
        return ResponseEntity.ok(shareUrl);
    }

    @GetMapping
    public ResponseEntity<Page<QuoteDTO>> getAllQuotes(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        Long userId = userDetails != null ? userService.getUserIdByUsername(userDetails.getUsername()) : null;
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(direction), sort);
        return ResponseEntity.ok(quoteService.getAllQuotes(userId, pageable));
    }
} 