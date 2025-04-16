package aybu.graduationproject.okuyorum.library.service;

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
        return convertToResponse(savedPost);
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getUserPosts(Long userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostResponse updatePost(Long postId, PostRequest request, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post.java not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this post");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        Post updatedPost = postRepository.save(post);
        return convertToResponse(updatedPost);
    }

    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post.java not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }

        postRepository.delete(post);
    }

    private PostResponse convertToResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setUserId(post.getUser().getId());
        response.setUsername(post.getUser().getUsername());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        return response;
    }
} 