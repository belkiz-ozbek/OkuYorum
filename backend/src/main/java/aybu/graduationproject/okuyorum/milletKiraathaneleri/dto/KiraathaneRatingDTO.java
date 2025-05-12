package aybu.graduationproject.okuyorum.milletKiraathaneleri.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KiraathaneRatingDTO {
    private Long id;
    private Long kiraathaneId;
    private Long userId;
    private String userName;
    
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @Size(max = 500, message = "Comment cannot be longer than 500 characters")
    private String comment;
    
    private LocalDateTime createdAt;
} 