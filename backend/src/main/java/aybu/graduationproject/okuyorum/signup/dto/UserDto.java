package aybu.graduationproject.okuyorum.signup.dto;

public class UserDto {
    private String nameSurname;
    private String username;
    private String password;

    // Default constructor
    public UserDto() {
    }

    // All args constructor
    public UserDto(String nameSurname, String username, String password) {
        this.nameSurname = nameSurname;
        this.username = username;
        this.password = password;
    }

    // Getters and Setters
    public String getNameSurname() {
        return nameSurname;
    }

    public void setNameSurname(String nameSurname) {
        this.nameSurname = nameSurname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
