package aybu.graduationproject.okuyorum.signup.dto;

public class AuthenticationResponse {
    private String token;
    private String message;

    // Default constructor
    public AuthenticationResponse() {
    }

    // Constructor with parameters
    public AuthenticationResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    // Static builder method
    public static Builder builder() {
        return new Builder();
    }

    // Builder class
    public static class Builder {
        private String token;
        private String message;

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public AuthenticationResponse build() {
            return new AuthenticationResponse(token, message);
        }
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
} 