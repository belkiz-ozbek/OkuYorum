package aybu.graduationproject.okuyorum.user.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "reading_activities")
public class ReadingActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "activity_date")
    private LocalDate activityDate;

    @Column(name = "books_read")
    private Integer booksRead;

    @Column(name = "pages_read")
    private Integer pagesRead;

    @Column(name = "reading_minutes")
    private Integer readingMinutes;

    @Column(name = "last_read_date")
    private LocalDate lastReadDate;

    @Column(name = "consecutive_days")
    private Integer consecutiveDays;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (lastReadDate == null) {
            lastReadDate = LocalDate.now();
        }
        if (consecutiveDays == null) {
            consecutiveDays = 1;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

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

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public Integer getBooksRead() {
        return booksRead;
    }

    public void setBooksRead(Integer booksRead) {
        this.booksRead = booksRead;
    }

    public Integer getPagesRead() {
        return pagesRead;
    }

    public void setPagesRead(Integer pagesRead) {
        this.pagesRead = pagesRead;
    }

    public Integer getReadingMinutes() {
        return readingMinutes;
    }

    public void setReadingMinutes(Integer readingMinutes) {
        this.readingMinutes = readingMinutes;
    }

    public LocalDate getLastReadDate() {
        return lastReadDate;
    }

    public void setLastReadDate(LocalDate lastReadDate) {
        this.lastReadDate = lastReadDate;
    }

    public Integer getConsecutiveDays() {
        return consecutiveDays;
    }

    public void setConsecutiveDays(Integer consecutiveDays) {
        this.consecutiveDays = consecutiveDays;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 