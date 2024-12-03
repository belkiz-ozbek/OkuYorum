package aybu.graduationproject.okuyorum.signup.entity;

import aybu.graduationproject.okuyorum.signup.enums.Role;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameSurname;
    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public User(Long id, String nameSurname, String username, String password, Role role) {
        this.id = id;
        this.nameSurname = nameSurname;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public User() {
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return this.username; // Username getter override
    }

    @Override
    public String getPassword() {
        return this.password; // Password getter override
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Hesap süresiz geçerli
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Hesap kilitli değil
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Kullanıcı bilgileri süresiz geçerli
    }

    @Override
    public boolean isEnabled() {
        return true; // Kullanıcı aktif durumda
    }

    public Long getId() {
        return this.id;
    }

    public String getNameSurname() {
        return this.nameSurname;
    }

    public Role getRole() {
        return this.role;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof User)) return false;
        final User other = (User) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
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
        final Object this$role = this.getRole();
        final Object other$role = other.getRole();
        if (this$role == null ? other$role != null : !this$role.equals(other$role)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof User;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $nameSurname = this.getNameSurname();
        result = result * PRIME + ($nameSurname == null ? 43 : $nameSurname.hashCode());
        final Object $username = this.getUsername();
        result = result * PRIME + ($username == null ? 43 : $username.hashCode());
        final Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        final Object $role = this.getRole();
        result = result * PRIME + ($role == null ? 43 : $role.hashCode());
        return result;
    }

    public String toString() {
        return "User(id=" + this.getId() + ", nameSurname=" + this.getNameSurname() + ", username=" + this.getUsername() + ", password=" + this.getPassword() + ", role=" + this.getRole() + ")";
    }

    public static class UserBuilder {
        private Long id;
        private String nameSurname;
        private String username;
        private String password;
        private Role role;

        UserBuilder() {
        }

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder nameSurname(String nameSurname) {
            this.nameSurname = nameSurname;
            return this;
        }

        public UserBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public User build() {
            return new User(this.id, this.nameSurname, this.username, this.password, this.role);
        }

        public String toString() {
            return "User.UserBuilder(id=" + this.id + ", nameSurname=" + this.nameSurname + ", username=" + this.username + ", password=" + this.password + ", role=" + this.role + ")";
        }
    }
}
