package aybu.graduationproject.okuyorum.milletKiraathaneleri.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "kiraathane_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KiraathaneEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime eventDate;

    private LocalDateTime endDate;
    
    @Enumerated(EnumType.STRING)
    private EventType eventType;
    
    private String imageUrl;
    
    private Integer capacity;
    
    private Integer registeredAttendees;
    
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kiraathane_id", nullable = false)
    private Kiraathane kiraathane;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum EventType {
        GENEL_TARTISMA,
        KITAP_TARTISMA,
        YAZAR_SOHBETI,
        OKUMA_ETKINLIGI,
        SEMINER,
        EGITIM,
        DIGER
    }
} 