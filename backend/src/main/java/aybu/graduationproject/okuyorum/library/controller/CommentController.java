package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.dto.CommentDTO;
import aybu.graduationproject.okuyorum.library.dto.CreateCommentRequest;
import aybu.graduationproject.okuyorum.library.dto.UpdateCommentRequest;
import aybu.graduationproject.okuyorum.library.service.CommentService;
import aybu.graduationproject.okuyorum.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;
    private final UserService userService;

    @Autowired
    public CommentController(CommentService commentService, UserService userService) {
        this.commentService = commentService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentDTO> createComment(
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(commentService.createComment(request, userId));
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(commentService.updateComment(commentId, request.getContent(), userId));
    }

    @PostMapping("/{commentId}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> toggleLike(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        commentService.toggleLike(commentId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/quote/{quoteId}")
    public ResponseEntity<List<CommentDTO>> getQuoteComments(@PathVariable Long quoteId) {
        return ResponseEntity.ok(commentService.getQuoteComments(quoteId));
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<CommentDTO>> getReviewComments(@PathVariable Long reviewId) {
        return ResponseEntity.ok(commentService.getReviewComments(reviewId));
    }

    @PostMapping("/{commentId}/reply")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentDTO> replyToComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(commentService.replyToComment(commentId, request, userId));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getPostComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getPostComments(postId));
    }
} 