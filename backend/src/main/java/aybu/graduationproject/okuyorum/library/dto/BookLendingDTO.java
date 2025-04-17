package aybu.graduationproject.okuyorum.library.dto;

import aybu.graduationproject.okuyorum.library.entity.BookLending;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookLendingDTO {
    private Long id;
    private Long bookId;
    private Long userId;
    private LocalDateTime lendDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private BookLending.LendingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 