package aybu.graduationproject.okuyorum.milletKiraathaneleri.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KiraathaneDTO {
    private Long id;
    private String name;
    private String address;
    private String description;
    private String city;
    private String district;
    private String phoneNumber;
    private String email;
    private String workingHours;
    private String imageUrl;
    private String mapCoordinates;
    private LocalDateTime createdAt;
    private List<KiraathaneEventDTO> upcomingEvents;
} 