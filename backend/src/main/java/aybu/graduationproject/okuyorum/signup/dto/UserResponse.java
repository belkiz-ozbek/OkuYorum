package aybu.graduationproject.okuyorum.signup.dto;

public class UserResponse {

    private String token;

    public UserResponse(String token) {
        this.token = token;
    }

    public UserResponse() {
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

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof UserResponse)) return false;
        final UserResponse other = (UserResponse) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$token = this.getToken();
        final Object other$token = other.getToken();
        if (this$token == null ? other$token != null : !this$token.equals(other$token)) return false;
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
        return result;
    }

    public String toString() {
        return "UserResponse(token=" + this.getToken() + ")";
    }

    public static class UserResponseBuilder {
        private String token;

        UserResponseBuilder() {
        }

        public UserResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public UserResponse build() {
            return new UserResponse(this.token);
        }

        public String toString() {
            return "UserResponse.UserResponseBuilder(token=" + this.token + ")";
        }
    }
}
