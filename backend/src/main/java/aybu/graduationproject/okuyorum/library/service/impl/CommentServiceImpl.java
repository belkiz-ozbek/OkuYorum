package aybu.graduationproject.okuyorum.library.service.impl;

import aybu.graduationproject.okuyorum.library.dto.CommentDTO;
import aybu.graduationproject.okuyorum.library.dto.CreateCommentRequest;
import aybu.graduationproject.okuyorum.library.entity.Comment;
import aybu.graduationproject.okuyorum.library.entity.Quote;
import aybu.graduationproject.okuyorum.library.repository.CommentRepository;
import aybu.graduationproject.okuyorum.library.repository.QuoteRepository;
import aybu.graduationproject.okuyorum.library.service.CommentService;
import aybu.graduationproject.okuyorum.notification.service.NotificationService;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final QuoteRepository quoteRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public CommentDTO createComment(CreateCommentRequest request, Long userId) {
        Quote quote = quoteRepository.findById(request.getQuoteId())
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setQuote(quote);
        comment.setUser(user);
        comment.setContent(request.getContent());

        Comment savedComment = commentRepository.save(comment);

        // Eğer yorum yapan kişi alıntının sahibi değilse bildirim gönder
        if (!quote.getUser().getId().equals(userId)) {
            notificationService.createNotification(
                quote.getUser().getId(),
                userId,
                "COMMENT",
                String.format("%s alıntınıza yorum yaptı", user.getUsername()),
                String.format("/quotes/%d", quote.getId())
            );
        }

        return convertToDTO(savedComment);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    @Override
    public List<CommentDTO> getQuoteComments(Long quoteId) {
        return commentRepository.findByQuoteIdOrderByCreatedAtDesc(quoteId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getUserComments(Long userId) {
        return commentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setQuoteId(comment.getQuote().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
} 