package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.CommentDTO;
import aybu.graduationproject.okuyorum.library.dto.CreateCommentRequest;

import java.util.List;

public interface CommentService {
    CommentDTO createComment(CreateCommentRequest request, Long userId);
    void deleteComment(Long commentId, Long userId);
    List<CommentDTO> getQuoteComments(Long quoteId, Long userId);
    List<CommentDTO> getUserComments(Long userId);
    CommentDTO updateComment(Long commentId, String content, Long userId);
    void toggleLike(Long commentId, Long userId);
    CommentDTO replyToComment(Long parentCommentId, CreateCommentRequest request, Long userId);
} 