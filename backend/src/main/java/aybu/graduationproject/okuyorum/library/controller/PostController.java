package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.dto.PostRequest;
import aybu.graduationproject.okuyorum.library.dto.PostResponse;
import aybu.graduationproject.okuyorum.library.service.PostService;
import aybu.graduationproject.okuyorum.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestBody PostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(postService.createPost(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = userDetails != null ? 
            userService.getUserIdByUsername(userDetails.getUsername()) : null;
        return ResponseEntity.ok(postService.getAllPosts(currentUserId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getUserPosts(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = userDetails != null ? 
            userService.getUserIdByUsername(userDetails.getUsername()) : null;
        return ResponseEntity.ok(postService.getUserPosts(userId, currentUserId));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long postId,
            @RequestBody PostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(postService.updatePost(postId, request, userId));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        postService.deletePost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<PostResponse> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(postService.toggleLike(postId, userId));
    }

    @PostMapping("/{postId}/save")
    public ResponseEntity<PostResponse> toggleSave(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(postService.toggleSave(postId, userId));
    }

    @PostMapping("/{postId}/share")
    public ResponseEntity<String> sharePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdByUsername(userDetails.getUsername());
        String shareUrl = postService.sharePost(postId, userId);
        return ResponseEntity.ok(shareUrl);
    }
} 