package aybu.graduationproject.okuyorum.signup.dto;

public class UserDto {

    private String nameSurname;
    private String username;
    private String password;

    public UserDto(String nameSurname, String username, String password) {
        this.nameSurname = nameSurname;
        this.username = username;
        this.password = password;
    }

    public UserDto() {
    }

    public static UserDtoBuilder builder() {
        return new UserDtoBuilder();
    }

    public String getNameSurname() {
        return this.nameSurname;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setNameSurname(String nameSurname) {
        this.nameSurname = nameSurname;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof UserDto)) return false;
        final UserDto other = (UserDto) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$nameSurname = this.getNameSurname();
        final Object other$nameSurname = other.getNameSurname();
        if (this$nameSurname == null ? other$nameSurname != null : !this$nameSurname.equals(other$nameSurname))
            return false;
        final Object this$username = this.getUsername();
        final Object other$username = other.getUsername();
        if (this$username == null ? other$username != null : !this$username.equals(other$username)) return false;
        final Object this$password = this.getPassword();
        final Object other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof UserDto;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $nameSurname = this.getNameSurname();
        result = result * PRIME + ($nameSurname == null ? 43 : $nameSurname.hashCode());
        final Object $username = this.getUsername();
        result = result * PRIME + ($username == null ? 43 : $username.hashCode());
        final Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        return result;
    }

    public String toString() {
        return "UserDto(nameSurname=" + this.getNameSurname() + ", username=" + this.getUsername() + ", password=" + this.getPassword() + ")";
    }

    public static class UserDtoBuilder {
        private String nameSurname;
        private String username;
        private String password;

        UserDtoBuilder() {
        }

        public UserDtoBuilder nameSurname(String nameSurname) {
            this.nameSurname = nameSurname;
            return this;
        }

        public UserDtoBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserDtoBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserDto build() {
            return new UserDto(this.nameSurname, this.username, this.password);
        }

        public String toString() {
            return "UserDto.UserDtoBuilder(nameSurname=" + this.nameSurname + ", username=" + this.username + ", password=" + this.password + ")";
        }
    }
}
