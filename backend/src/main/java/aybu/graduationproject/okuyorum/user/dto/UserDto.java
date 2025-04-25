package aybu.graduationproject.okuyorum.user.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String username;
    private String nameSurname;
    private String email;
    private String bio;
    private LocalDate birthDate;
    private String profileImage;
    private String headerImage;
    private Integer followers;
    private Integer following;
    private Integer booksRead;
    private Integer readerScore;
    private Integer yearlyGoal;
    private Integer readingHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNameSurname() {
        return nameSurname;
    }

    public void setNameSurname(String nameSurname) {
        this.nameSurname = nameSurname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getHeaderImage() {
        return headerImage;
    }

    public void setHeaderImage(String headerImage) {
        this.headerImage = headerImage;
    }

    public Integer getFollowers() {
        return followers;
    }

    public void setFollowers(Integer followers) {
        this.followers = followers;
    }

    public Integer getFollowing() {
        return following;
    }

    public void setFollowing(Integer following) {
        this.following = following;
    }

    public Integer getBooksRead() {
        return booksRead;
    }

    public void setBooksRead(Integer booksRead) {
        this.booksRead = booksRead;
    }

    public Integer getReaderScore() {
        return readerScore;
    }

    public void setReaderScore(Integer readerScore) {
        this.readerScore = readerScore;
    }

    public Integer getYearlyGoal() {
        return yearlyGoal;
    }

    public void setYearlyGoal(Integer yearlyGoal) {
        this.yearlyGoal = yearlyGoal;
    }

    public Integer getReadingHours() {
        return readingHours;
    }

    public void setReadingHours(Integer readingHours) {
        this.readingHours = readingHours;
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