package aybu.graduationproject.okuyorum.library.service.impl;

import aybu.graduationproject.okuyorum.library.dto.CommentDTO;
import aybu.graduationproject.okuyorum.library.dto.CreateCommentRequest;
import aybu.graduationproject.okuyorum.library.entity.Comment;
import aybu.graduationproject.okuyorum.library.entity.CommentLike;
import aybu.graduationproject.okuyorum.library.entity.Quote;
import aybu.graduationproject.okuyorum.library.repository.CommentLikeRepository;
import aybu.graduationproject.okuyorum.library.repository.CommentRepository;
import aybu.graduationproject.okuyorum.library.repository.QuoteRepository;
import aybu.graduationproject.okuyorum.library.service.CommentService;
import aybu.graduationproject.okuyorum.notification.service.NotificationService;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final QuoteRepository quoteRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public CommentDTO createComment(CreateCommentRequest request, Long userId) {
        Quote quote = quoteRepository.findById(request.getQuoteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quote not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Comment comment = new Comment();
        comment.setQuote(quote);
        comment.setUser(user);
        comment.setContent(request.getContent());

        Comment savedComment = commentRepository.save(comment);

        if (!quote.getUser().getId().equals(userId)) {
            notificationService.createNotification(
                quote.getUser().getId(),
                userId,
                "COMMENT",
                String.format("%s alıntınıza yorum yaptı", user.getUsername()),
                String.format("/quotes/%d", quote.getId())
            );
        }

        return convertToDTO(savedComment, userId);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own comments");
        }

        // Önce beğenileri silelim
        commentLikeRepository.deleteAll(comment.getLikes());
        
        // Sonra yorumu silelim
        commentRepository.delete(comment);
        commentRepository.flush();
    }

    @Override
    @Transactional
    public CommentDTO updateComment(Long commentId, String content, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own comments");
        }

        comment.setContent(content);
        Comment updatedComment = commentRepository.saveAndFlush(comment);
        return convertToDTO(updatedComment, userId);
    }

    @Override
    @Transactional
    public void toggleLike(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        boolean hasLiked = commentLikeRepository.existsByCommentIdAndUserId(commentId, userId);

        if (hasLiked) {
            commentLikeRepository.deleteByCommentIdAndUserId(commentId, userId);
        } else {
            CommentLike like = new CommentLike();
            like.setComment(comment);
            like.setUser(user);
            commentLikeRepository.save(like);

            if (!comment.getUser().getId().equals(userId)) {
                notificationService.createNotification(
                    comment.getUser().getId(),
                    userId,
                    "COMMENT_LIKE",
                    String.format("%s yorumunuzu beğendi", user.getUsername()),
                    String.format("/quotes/%d", comment.getQuote().getId())
                );
            }
        }

        commentRepository.flush();
        commentLikeRepository.flush();
    }

    @Override
    @Transactional
    public CommentDTO replyToComment(Long parentCommentId, CreateCommentRequest request, Long userId) {
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent comment not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Comment reply = new Comment();
        reply.setQuote(parentComment.getQuote());
        reply.setUser(user);
        reply.setContent(request.getContent());
        reply.setParentComment(parentComment);

        Comment savedReply = commentRepository.saveAndFlush(reply);

        if (!parentComment.getUser().getId().equals(userId)) {
            notificationService.createNotification(
                parentComment.getUser().getId(),
                userId,
                "COMMENT_REPLY",
                String.format("%s yorumunuza yanıt verdi", user.getUsername()),
                String.format("/quotes/%d", parentComment.getQuote().getId())
            );
        }

        return convertToDTO(savedReply, userId);
    }

    @Override
    public List<CommentDTO> getQuoteComments(Long quoteId, Long userId) {
        return commentRepository.findByQuoteIdOrderByCreatedAtDesc(quoteId).stream()
                .filter(comment -> comment.getParentComment() == null) // Only get top-level comments
                .map(comment -> convertToDTO(comment, userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getUserComments(Long userId) {
        return commentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(comment -> convertToDTO(comment, userId))
                .collect(Collectors.toList());
    }

    private CommentDTO convertToDTO(Comment comment, Long currentUserId) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setQuoteId(comment.getQuote().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        
        if (comment.getParentComment() != null) {
            dto.setParentCommentId(comment.getParentComment().getId());
        }

        dto.setReplies(comment.getReplies().stream()
                .map(reply -> convertToDTO(reply, currentUserId))
                .collect(Collectors.toList()));

        dto.setLikesCount(comment.getLikes().size());
        
        if (currentUserId != null) {
            dto.setLiked(commentLikeRepository.existsByCommentIdAndUserId(comment.getId(), currentUserId));
        }

        return dto;
    }
} 