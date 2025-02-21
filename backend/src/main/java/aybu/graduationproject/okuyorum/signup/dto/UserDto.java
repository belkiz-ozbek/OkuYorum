package aybu.graduationproject.okuyorum.signup.dto;

public class UserDto {
    private String username;
    private String email;
    private String password;
    private String nameSurname;

    // Default constructor
    public UserDto() {
    }

    // All args constructor
    public UserDto(String username, String email, String password, String nameSurname) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.nameSurname = nameSurname;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNameSurname() {
        return nameSurname;
    }

    public void setNameSurname(String nameSurname) {
        this.nameSurname = nameSurname;
    }
}
