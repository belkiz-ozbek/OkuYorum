package aybu.graduationproject.okuyorum.milletKiraathaneleri.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "kiraathanes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Kiraathane {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String address;
    
    private String description;
    
    private String city;
    
    private String district;
    
    private String phoneNumber;
    
    private String email;
    
    private String workingHours;
    
    private String imageUrl;
    
    private String mapCoordinates;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "kiraathane", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KiraathaneEvent> events = new ArrayList<>();
} 