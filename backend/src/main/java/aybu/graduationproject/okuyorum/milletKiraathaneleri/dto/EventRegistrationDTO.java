package aybu.graduationproject.okuyorum.milletKiraathaneleri.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistrationDTO {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private LocalDateTime eventDate;
    private Long userId;
    private String userName;
    private LocalDateTime registeredAt;
    private Boolean attended;
} 