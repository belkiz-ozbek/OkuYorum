package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.BookResponse;
import aybu.graduationproject.okuyorum.library.dto.PostRequest;
import aybu.graduationproject.okuyorum.library.dto.PostResponse;
import aybu.graduationproject.okuyorum.library.entity.Post;
import aybu.graduationproject.okuyorum.library.repository.PostRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public PostResponse createPost(PostRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setUser(user);

        Post savedPost = postRepository.save(post);
        return convertToResponse(savedPost, userId);
    }

    public List<PostResponse> getAllPosts(Long currentUserId) {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(post -> convertToResponse(post, currentUserId))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getUserPosts(Long userId, Long currentUserId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(post -> convertToResponse(post, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public PostResponse updatePost(Long postId, PostRequest request, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this post");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        Post updatedPost = postRepository.save(post);
        return convertToResponse(updatedPost, userId);
    }

    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }

        postRepository.delete(post);
    }

    @Transactional
    public PostResponse toggleLike(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (post.getLikedBy().contains(user)) {
            post.getLikedBy().remove(user);
            post.setLikesCount(post.getLikesCount() - 1);
        } else {
            post.getLikedBy().add(user);
            post.setLikesCount(post.getLikesCount() + 1);
        }

        Post updatedPost = postRepository.save(post);
        return convertToResponse(updatedPost, userId);
    }

    @Transactional
    public PostResponse toggleSave(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (post.getSavedBy().contains(user)) {
            post.getSavedBy().remove(user);
        } else {
            post.getSavedBy().add(user);
        }

        Post updatedPost = postRepository.save(post);
        return convertToResponse(updatedPost, userId);
    }

    @Transactional
    public void incrementCommentCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);
    }

    @Transactional
    public void decrementCommentCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setCommentsCount(post.getCommentsCount() - 1);
        postRepository.save(post);
    }

    @Transactional
    public String sharePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        // Generate a shareable URL for the post
        return "/posts/" + postId;
    }

    private PostResponse convertToResponse(Post post, Long currentUserId) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setUserId(post.getUser().getId());
        response.setUsername(post.getUser().getUsername());
        response.setUserAvatar(post.getUser().getProfileImage());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setLikesCount(post.getLikesCount());
        response.setCommentsCount(post.getCommentsCount());
        
        if (currentUserId != null) {
            User currentUser = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            response.setIsLiked(post.getLikedBy().contains(currentUser));
            response.setIsSaved(post.getSavedBy().contains(currentUser));
        }

        return response;
    }
} 