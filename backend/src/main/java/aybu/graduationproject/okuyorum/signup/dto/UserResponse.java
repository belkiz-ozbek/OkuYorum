package aybu.graduationproject.okuyorum.signup.dto;

public class UserResponse {

    private String token;
    private String message;
    private Long tempToken;

    public UserResponse() {
    }

    public UserResponse(String token, String message, Long tempToken) {
        this.token = token;
        this.message = message;
        this.tempToken = tempToken;
    }

    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getTempToken() {
        return this.tempToken;
    }

    public void setTempToken(Long tempToken) {
        this.tempToken = tempToken;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof UserResponse)) return false;
        final UserResponse other = (UserResponse) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$token = this.getToken();
        final Object other$token = other.getToken();
        if (this$token == null ? other$token != null : !this$token.equals(other$token)) return false;
        final Object this$message = this.getMessage();
        final Object other$message = other.getMessage();
        if (this$message == null ? other$message != null : !this$message.equals(other$message)) return false;
        final Object this$tempToken = this.getTempToken();
        final Object other$tempToken = other.getTempToken();
        if (this$tempToken == null ? other$tempToken != null : !this$tempToken.equals(other$tempToken)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof UserResponse;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $token = this.getToken();
        result = result * PRIME + ($token == null ? 43 : $token.hashCode());
        final Object $message = this.getMessage();
        result = result * PRIME + ($message == null ? 43 : $message.hashCode());
        final Object $tempToken = this.getTempToken();
        result = result * PRIME + ($tempToken == null ? 43 : $tempToken.hashCode());
        return result;
    }

    public String toString() {
        return "UserResponse(token=" + this.getToken() + ", message=" + this.getMessage() + ", tempToken=" + this.getTempToken() + ")";
    }

    public static class UserResponseBuilder {
        private String token;
        private String message;
        private Long tempToken;

        UserResponseBuilder() {
        }

        public UserResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public UserResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public UserResponseBuilder tempToken(Long tempToken) {
            this.tempToken = tempToken;
            return this;
        }

        public UserResponse build() {
            return new UserResponse(token, message, tempToken);
        }

        public String toString() {
            return "UserResponse.UserResponseBuilder(token=" + this.token + ", message=" + this.message + ", tempToken=" + this.tempToken + ")";
        }
    }
}
