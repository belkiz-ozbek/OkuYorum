package aybu.graduationproject.okuyorum.library.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookFeedbackDTO {
    private Long id;
    private Long bookId;
    private Long userId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 