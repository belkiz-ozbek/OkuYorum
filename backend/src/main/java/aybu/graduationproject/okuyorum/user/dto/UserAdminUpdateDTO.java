package aybu.graduationproject.okuyorum.user.dto;

import aybu.graduationproject.okuyorum.user.enums.Role;
import aybu.graduationproject.okuyorum.user.enums.UserStatus;

public class UserAdminUpdateDTO {
    private String username;
    private String email;
    private String nameSurname;
    private String role;
    private String status;

    // Getters
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getNameSurname() {
        return nameSurname;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }

    // Setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNameSurname(String nameSurname) {
        this.nameSurname = nameSurname;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setStatus(String status) {
        this.status = status;
    }
} 