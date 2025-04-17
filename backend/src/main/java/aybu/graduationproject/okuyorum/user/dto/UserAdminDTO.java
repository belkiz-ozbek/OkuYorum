package aybu.graduationproject.okuyorum.user.dto;

import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.enums.Role;
import aybu.graduationproject.okuyorum.user.enums.UserStatus;

import java.time.LocalDateTime;

public class UserAdminDTO {
    private Long id;
    private String username;
    private String email;
    private String nameSurname;
    private Role role;
    private UserStatus status;
    private LocalDateTime lastLoginDate;
    private String lastLoginIp;
    private Integer failedLoginAttempts;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor
    public UserAdminDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.nameSurname = user.getNameSurname();
        this.role = user.getRole();
        this.status = user.getStatus();
        this.lastLoginDate = user.getLastLoginDate();
        this.lastLoginIp = user.getLastLoginIp();
        this.failedLoginAttempts = user.getFailedLoginAttempts();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getNameSurname() {
        return nameSurname;
    }

    public Role getRole() {
        return role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public LocalDateTime getLastLoginDate() {
        return lastLoginDate;
    }

    public String getLastLoginIp() {
        return lastLoginIp;
    }

    public Integer getFailedLoginAttempts() {
        return failedLoginAttempts;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
} 