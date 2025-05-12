package aybu.graduationproject.okuyorum.milletKiraathaneleri.dto;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.model.KiraathaneFeature;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

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
    private LocalTime openingTime;
    private LocalTime closingTime;
    private List<String> photoUrls;
    private String featuredPhotoUrl;
    private String mapCoordinates;
    private Integer bookCount;
    private Double averageRating;
    private Integer totalRatings;
    private Set<KiraathaneFeature> features;
    private LocalDateTime createdAt;
    private List<KiraathaneEventDTO> upcomingEvents;
    private List<KiraathaneRatingDTO> recentRatings;
} 