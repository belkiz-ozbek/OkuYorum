package aybu.graduationproject.okuyorum.donation.entity;

import aybu.graduationproject.okuyorum.signup.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_requests")
public class DonationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id")
    private User requester;
    
    @Column(nullable = false)
    private String bookTitle;
    
    private String author;
    
    private String genre;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // Okul/Kütüphane talepleri için
    private String institutionName;
    
    private String address;
    
    private Double latitude;
    
    private Double longitude;
    
    // İlişkiler
    @OneToOne(mappedBy = "request")
    private Donation donation;
    
    private DonationStatus donationStatus = DonationStatus.PENDING;
    private LocalDateTime donationStatusUpdatedAt;
    private String donationStatusNote;
    private String donationTrackingCode;
    private String donationDeliveryMethod;
    private LocalDateTime donationEstimatedDeliveryDate;
    private String donationHandlerName;
    
    public DonationRequest() {
        this.createdAt = LocalDateTime.now();
        this.status = RequestStatus.PENDING;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public RequestType getType() {
        return type;
    }

    public void setType(RequestType type) {
        this.type = type;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public Donation getDonation() {
        return donation;
    }

    public void setDonation(Donation donation) {
        this.donation = donation;
    }

    public DonationStatus getDonationStatus() {
        return donationStatus;
    }

    public void setDonationStatus(DonationStatus donationStatus) {
        this.donationStatus = donationStatus;
    }

    public LocalDateTime getDonationStatusUpdatedAt() {
        return donationStatusUpdatedAt;
    }

    public void setDonationStatusUpdatedAt(LocalDateTime donationStatusUpdatedAt) {
        this.donationStatusUpdatedAt = donationStatusUpdatedAt;
    }

    public String getDonationStatusNote() {
        return donationStatusNote;
    }

    public void setDonationStatusNote(String donationStatusNote) {
        this.donationStatusNote = donationStatusNote;
    }

    public String getDonationTrackingCode() {
        return donationTrackingCode;
    }

    public void setDonationTrackingCode(String donationTrackingCode) {
        this.donationTrackingCode = donationTrackingCode;
    }

    public String getDonationDeliveryMethod() {
        return donationDeliveryMethod;
    }

    public void setDonationDeliveryMethod(String donationDeliveryMethod) {
        this.donationDeliveryMethod = donationDeliveryMethod;
    }

    public LocalDateTime getDonationEstimatedDeliveryDate() {
        return donationEstimatedDeliveryDate;
    }

    public void setDonationEstimatedDeliveryDate(LocalDateTime donationEstimatedDeliveryDate) {
        this.donationEstimatedDeliveryDate = donationEstimatedDeliveryDate;
    }

    public String getDonationHandlerName() {
        return donationHandlerName;
    }

    public void setDonationHandlerName(String donationHandlerName) {
        this.donationHandlerName = donationHandlerName;
    }
} 