package aybu.graduationproject.okuyorum.milletKiraathaneleri.dto;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KiraathaneEventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private LocalDateTime endDate;
    private KiraathaneEvent.EventType eventType;
    private String imageUrl;
    private Integer capacity;
    private Integer registeredAttendees;
    private Boolean isActive;
    private Long kiraathaneId;
    private String kiraathaneName;
    private String kiraathaneAddress;
    private LocalDateTime createdAt;
} 