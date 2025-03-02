package aybu.graduationproject.okuyorum.donation.dto;

import aybu.graduationproject.okuyorum.donation.entity.DonationStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class DonationTrackingDto {
    private Long id;
    private Long donationId;
    private DonationStatus status;
    private String notes;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    private Long createdBy;
    private String createdByName;

    public DonationTrackingDto() {
    }

    public DonationTrackingDto(Long id, Long donationId, DonationStatus status, String notes, 
                              LocalDateTime createdAt, Long createdBy, String createdByName) {
        this.id = id;
        this.donationId = donationId;
        this.status = status;
        this.notes = notes;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.createdByName = createdByName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
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
} 