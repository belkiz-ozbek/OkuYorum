package aybu.graduationproject.okuyorum.library.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private Long userId;
    private String username;
    private String userAvatar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer likesCount;
    private Integer commentsCount;
    private Boolean isLiked;
    private Boolean isSaved;
    private BookResponse book;
} 