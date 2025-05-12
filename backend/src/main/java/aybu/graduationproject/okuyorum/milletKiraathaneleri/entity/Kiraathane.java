package aybu.graduationproject.okuyorum.milletKiraathaneleri.entity;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.model.KiraathaneFeature;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    // Çalışma saatleri için yapılandırılmış alanlar
    @Column(name = "opening_time")
    private LocalTime openingTime;

    @Column(name = "closing_time")
    private LocalTime closingTime;
    
    // Fotoğraf galerisi
    @ElementCollection
    @CollectionTable(name = "kiraathane_photos", joinColumns = @JoinColumn(name = "kiraathane_id"))
    @Column(name = "photo_url")
    private List<String> photoUrls = new ArrayList<>();
    
    // Öne çıkan fotoğraf
    @Column(name = "featured_photo_url")
    private String featuredPhotoUrl;
    
    private String mapCoordinates;

    // Kitap koleksiyonu bilgisi
    @Column(name = "book_count")
    private Integer bookCount;

    // Puanlama sistemi
    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "total_ratings")
    private Integer totalRatings = 0;

    @Column(name = "total_rating_sum")
    private Integer totalRatingSum = 0;

    // Öne çıkarma durumu
    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    // Kıraathane özellikleri
    @ElementCollection
    @CollectionTable(name = "kiraathane_features", joinColumns = @JoinColumn(name = "kiraathane_id"))
    @Enumerated(EnumType.STRING)
    private Set<KiraathaneFeature> features = new HashSet<>();
    
    @OneToMany(mappedBy = "kiraathane", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KiraathaneEvent> events = new ArrayList<>();

    @OneToMany(mappedBy = "kiraathane", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KiraathaneRating> ratings = new ArrayList<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Puan ekleme metodu
    public void addRating(int rating) {
        this.totalRatingSum += rating;
        this.totalRatings++;
        this.averageRating = this.totalRatingSum.doubleValue() / this.totalRatings;
    }

    // Puan güncelleme metodu
    public void updateRating(int oldRating, int newRating) {
        this.totalRatingSum = this.totalRatingSum - oldRating + newRating;
        this.averageRating = this.totalRatingSum.doubleValue() / this.totalRatings;
    }

    // Puan silme metodu
    public void removeRating(int rating) {
        this.totalRatingSum -= rating;
        this.totalRatings--;
        this.averageRating = this.totalRatings > 0 ? this.totalRatingSum.doubleValue() / this.totalRatings : 0.0;
    }
} 