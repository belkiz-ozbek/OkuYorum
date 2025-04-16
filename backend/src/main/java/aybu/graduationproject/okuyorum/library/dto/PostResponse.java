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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 