package aybu.graduationproject.okuyorum.donation.entity;

import aybu.graduationproject.okuyorum.signup.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "request_id")
    private DonationRequest request;

    private String bookTitle;
    private String author;
    private String genre;
    private String condition;
    private Integer quantity;
    private String description;
    
    @Column(columnDefinition = "decimal(10,6)")
    private Double latitude;
    
    @Column(columnDefinition = "decimal(10,6)")
    private Double longitude;
    
    private String institutionName;
    private String recipientName;
    private String address;
    private String donationType;
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private DonationStatus status = DonationStatus.PENDING;
    
    // Takip bilgileri
    private LocalDateTime statusUpdatedAt;
    private String statusNote;
    private String trackingCode;
    private String deliveryMethod;
    private LocalDateTime estimatedDeliveryDate;
    private String handlerName; // Bağışı işleyen görevli

    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationTracking> trackingHistory = new ArrayList<>();

    // Getter ve Setter metodları
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDonationType() {
        return donationType;
    }

    public void setDonationType(String donationType) {
        this.donationType = donationType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public DonationStatus getStatus() {
        return status;
    }

    public void setStatus(DonationStatus status) {
        this.status = status;
        this.statusUpdatedAt = LocalDateTime.now();
        
        // Yeni bir takip kaydı oluştur
        DonationTracking tracking = new DonationTracking();
        tracking.setStatus(status);
        tracking.setNotes(status.getDescription());
        tracking.setCreatedAt(LocalDateTime.now());
        tracking.setUpdatedAt(LocalDateTime.now());
        tracking.setCreatedBy(1L); // Varsayılan olarak sistem kullanıcısı
        tracking.setCreatedByName("Sistem");
        this.addTracking(tracking);
    }
    
    public LocalDateTime getStatusUpdatedAt() {
        return statusUpdatedAt;
    }

    public void setStatusUpdatedAt(LocalDateTime statusUpdatedAt) {
        this.statusUpdatedAt = statusUpdatedAt;
    }

    public String getStatusNote() {
        return statusNote;
    }

    public void setStatusNote(String statusNote) {
        this.statusNote = statusNote;
    }

    public String getTrackingCode() {
        return trackingCode;
    }

    public void setTrackingCode(String trackingCode) {
        this.trackingCode = trackingCode;
    }

    public String getDeliveryMethod() {
        return deliveryMethod;
    }

    public void setDeliveryMethod(String deliveryMethod) {
        this.deliveryMethod = deliveryMethod;
    }

    public LocalDateTime getEstimatedDeliveryDate() {
        return estimatedDeliveryDate;
    }

    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) {
        this.estimatedDeliveryDate = estimatedDeliveryDate;
    }

    public String getHandlerName() {
        return handlerName;
    }

    public void setHandlerName(String handlerName) {
        this.handlerName = handlerName;
    }

    public DonationRequest getRequest() {
        return request;
    }

    public void setRequest(DonationRequest request) {
        this.request = request;
    }

    public List<DonationTracking> getTrackingHistory() {
        return trackingHistory;
    }

    public void setTrackingHistory(List<DonationTracking> trackingHistory) {
        this.trackingHistory = trackingHistory;
    }

    public void addTracking(DonationTracking tracking) {
        trackingHistory.add(tracking);
        tracking.setDonation(this);
    }

    public void removeTracking(DonationTracking tracking) {
        trackingHistory.remove(tracking);
        tracking.setDonation(null);
    }
} 