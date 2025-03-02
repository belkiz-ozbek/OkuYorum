package aybu.graduationproject.okuyorum.donation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_tracking")
public class DonationTracking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status;
    
    @Column(length = 500)
    private String notes;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private Long createdBy;
    
    @Column(length = 100)
    private String createdByName;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    public DonationTracking() {
        // Varsayılan olarak oluşturma ve güncelleme zamanlarını şimdiki zaman olarak ayarla
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Donation getDonation() {
        return donation;
    }
    
    public void setDonation(Donation donation) {
        this.donation = donation;
    }
    
    public DonationStatus getStatus() {
        return status;
    }
    
    public void setStatus(DonationStatus status) {
        this.status = status;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Long getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
    
    public String getCreatedByName() {
        return createdByName;
    }
    
    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 