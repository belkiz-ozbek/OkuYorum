package aybu.graduationproject.okuyorum.signup.dto;

public class UserRequest {

    String password;
    private String username;

    public UserRequest(String password, String username) {
        this.password = password;
        this.username = username;
    }

    public UserRequest() {
    }

    public static UserRequestBuilder builder() {
        return new UserRequestBuilder();
    }

    public String getPassword() {
        return this.password;
    }

    public String getUsername() {
        return this.username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof UserRequest)) return false;
        final UserRequest other = (UserRequest) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$password = this.getPassword();
        final Object other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
        final Object this$username = this.getUsername();
        final Object other$username = other.getUsername();
        if (this$username == null ? other$username != null : !this$username.equals(other$username)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof UserRequest;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        final Object $username = this.getUsername();
        result = result * PRIME + ($username == null ? 43 : $username.hashCode());
        return result;
    }

    public String toString() {
        return "UserRequest(password=" + this.getPassword() + ", username=" + this.getUsername() + ")";
    }

    public static class UserRequestBuilder {
        private String password;
        private String username;

        UserRequestBuilder() {
        }

        public UserRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserRequestBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserRequest build() {
            return new UserRequest(this.password, this.username);
        }

        public String toString() {
            return "UserRequest.UserRequestBuilder(password=" + this.password + ", username=" + this.username + ")";
        }
    }
}
