package aybu.graduationproject.okuyorum.library.service.impl;

import aybu.graduationproject.okuyorum.library.dto.CommentDTO;
import aybu.graduationproject.okuyorum.library.dto.CreateCommentRequest;
import aybu.graduationproject.okuyorum.library.entity.Comment;
import aybu.graduationproject.okuyorum.library.entity.CommentLike;
import aybu.graduationproject.okuyorum.library.entity.Quote;
import aybu.graduationproject.okuyorum.library.entity.Review;
import aybu.graduationproject.okuyorum.library.repository.CommentLikeRepository;
import aybu.graduationproject.okuyorum.library.repository.CommentRepository;
import aybu.graduationproject.okuyorum.library.repository.QuoteRepository;
import aybu.graduationproject.okuyorum.library.repository.ReviewRepository;
import aybu.graduationproject.okuyorum.library.service.CommentService;
import aybu.graduationproject.okuyorum.notification.service.NotificationService;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final UserRepository userRepository;
    private final QuoteRepository quoteRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationService notificationService;

    @Autowired
    public CommentServiceImpl(
            CommentRepository commentRepository,
            CommentLikeRepository commentLikeRepository,
            UserRepository userRepository,
            QuoteRepository quoteRepository,
            ReviewRepository reviewRepository,
            NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.commentLikeRepository = commentLikeRepository;
        this.userRepository = userRepository;
        this.quoteRepository = quoteRepository;
        this.reviewRepository = reviewRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public CommentDTO createComment(CreateCommentRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setContent(request.getContent());

        if (request.getQuoteId() != null) {
            Quote quote = quoteRepository.findById(request.getQuoteId())
                    .orElseThrow(() -> new EntityNotFoundException("Quote not found"));
            comment.setQuote(quote);

            if (!quote.getUser().getId().equals(userId)) {
                notificationService.createNotification(
                    quote.getUser().getId(),
                    userId,
                    "QUOTE_COMMENT",
                    String.format("%s alıntınıza yorum yaptı", user.getUsername()),
                    String.format("/quotes/%d", quote.getId())
                );
            }
        } else if (request.getReviewId() != null) {
            Review review = reviewRepository.findById(request.getReviewId())
                    .orElseThrow(() -> new EntityNotFoundException("Review not found"));
            comment.setReview(review);

            if (!review.getUser().getId().equals(userId)) {
                notificationService.createNotification(
                    review.getUser().getId(),
                    userId,
                    "REVIEW_COMMENT",
                    String.format("%s incelemenize yorum yaptı", user.getUsername()),
                    String.format("/reviews/%d", review.getId())
                );
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Either quoteId or reviewId must be provided");
        }

        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment, userId);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own comments");
        }

        comment.setDeleted(true);
        commentRepository.save(comment);
    }

    @Override
    @Transactional
    public CommentDTO updateComment(Long commentId, String content, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own comments");
        }

        comment.setContent(content);
        Comment updatedComment = commentRepository.save(comment);
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
                    comment.getQuote() != null
                        ? String.format("/quotes/%d", comment.getQuote().getId())
                        : String.format("/reviews/%d", comment.getReview().getId())
                );
            }
        }

        commentRepository.flush();
        commentLikeRepository.flush();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getQuoteComments(Long quoteId) {
        List<Comment> comments = commentRepository.findByQuoteIdAndParentCommentIsNullAndDeletedFalseOrderByCreatedAtDesc(quoteId);
        return comments.stream()
                .map(comment -> convertToDTO(comment, null))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getReviewComments(Long reviewId) {
        List<Comment> comments = commentRepository.findByReviewIdAndParentCommentIsNullAndDeletedFalseOrderByCreatedAtDesc(reviewId);
        return comments.stream()
                .map(comment -> convertToDTO(comment, null))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentDTO replyToComment(Long commentId, CreateCommentRequest request, Long userId) {
        Comment parentComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Parent comment not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Comment reply = new Comment();
        reply.setUser(user);
        reply.setContent(request.getContent());
        reply.setParentComment(parentComment);

        if (parentComment.getQuote() != null) {
            reply.setQuote(parentComment.getQuote());
        } else if (parentComment.getReview() != null) {
            reply.setReview(parentComment.getReview());
        }

        Comment savedReply = commentRepository.save(reply);

        if (!parentComment.getUser().getId().equals(userId)) {
            notificationService.createNotification(
                parentComment.getUser().getId(),
                userId,
                "COMMENT_REPLY",
                String.format("%s yorumunuza yanıt verdi", user.getUsername()),
                parentComment.getQuote() != null
                    ? String.format("/quotes/%d", parentComment.getQuote().getId())
                    : String.format("/reviews/%d", parentComment.getReview().getId())
            );
        }

        return convertToDTO(savedReply, userId);
    }

    private CommentDTO convertToDTO(Comment comment, Long currentUserId) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        if (comment.getQuote() != null) {
            dto.setQuoteId(comment.getQuote().getId());
        }
        if (comment.getReview() != null) {
            dto.setReviewId(comment.getReview().getId());
        }
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        
        if (comment.getParentComment() != null) {
            dto.setParentCommentId(comment.getParentComment().getId());
        }

        List<CommentDTO> replies = comment.getReplies().stream()
                .filter(reply -> !reply.isDeleted())
                .map(reply -> convertToDTO(reply, currentUserId))
                .collect(Collectors.toList());
        dto.setReplies(replies);

        dto.setLikesCount(comment.getLikes().size());
        
        if (currentUserId != null) {
            dto.setIsLiked(commentLikeRepository.existsByCommentIdAndUserId(comment.getId(), currentUserId));
        } else {
            dto.setIsLiked(false);
        }

        return dto;
    }
} 