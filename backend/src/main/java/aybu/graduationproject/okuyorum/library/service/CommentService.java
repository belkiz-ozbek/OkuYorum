package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.CommentDTO;
import aybu.graduationproject.okuyorum.library.dto.CreateCommentRequest;

import java.util.List;

public interface CommentService {
    CommentDTO createComment(CreateCommentRequest request, Long userId);
    void deleteComment(Long commentId, Long userId);
    List<CommentDTO> getQuoteComments(Long quoteId);
    List<CommentDTO> getUserComments(Long userId);
} 