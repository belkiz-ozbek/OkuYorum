package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.dto.CommentDTO;
import aybu.graduationproject.okuyorum.library.dto.CreateCommentRequest;
import aybu.graduationproject.okuyorum.library.service.CommentService;
import aybu.graduationproject.okuyorum.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {
    private final CommentService commentService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentDTO> createComment(
            @RequestBody CreateCommentRequest request,
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

    @PutMapping("/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @RequestBody String content,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(commentService.updateComment(commentId, content, userId));
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

    @PostMapping("/{parentCommentId}/reply")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentDTO> replyToComment(
            @PathVariable Long parentCommentId,
            @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(commentService.replyToComment(parentCommentId, request, userId));
    }

    @GetMapping("/quote/{quoteId}")
    public ResponseEntity<List<CommentDTO>> getQuoteComments(
            @PathVariable Long quoteId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userDetails != null ? userService.getUserIdByUsername(userDetails.getUsername()) : null;
        return ResponseEntity.ok(commentService.getQuoteComments(quoteId, userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CommentDTO>> getUserComments(@PathVariable Long userId) {
        return ResponseEntity.ok(commentService.getUserComments(userId));
    }
} 