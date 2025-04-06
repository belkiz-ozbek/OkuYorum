package aybu.graduationproject.okuyorum.signup.entity;

import aybu.graduationproject.okuyorum.signup.enums.Role;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Collection;
import java.util.List;
import java.util.Date;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameSurname;

    @NotBlank(message = "Kullanıcı adı boş olamaz")
    @Size(min = 3, max = 50, message = "Kullanıcı adı 3-50 karakter arasında olmalıdır")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Kullanıcı adı sadece harf, rakam ve ._- karakterlerini içerebilir")
    @Column(unique = true)
    private String username;

    private String password;

    @NotBlank(message = "E-posta adresi boş olamaz")
    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", 
           message = "Geçerli bir e-posta adresi giriniz")
    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean enabled = false; // varsayılan olarak false

    // Yeni profil alanları
    @Temporal(TemporalType.DATE)
    private Date birthDate;

    @Column(length = 500)
    private String bio;

    private Integer readerScore = 0;

    private Integer booksRead = 0;

    private String profileImage;

    private String headerImage;

    private Integer followers = 0;

    private Integer following = 0;

    public User(Long id, String nameSurname, String username, String password, String email, Role role) {
        this.id = id;
        this.nameSurname = nameSurname;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    public User() {
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
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
        return enabled;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Integer getReaderScore() {
        return readerScore;
    }

    public void setReaderScore(Integer readerScore) {
        this.readerScore = readerScore;
    }

    public Integer getBooksRead() {
        return booksRead;
    }

    public void setBooksRead(Integer booksRead) {
        this.booksRead = booksRead;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getHeaderImage() {
        return headerImage;
    }

    public void setHeaderImage(String headerImage) {
        this.headerImage = headerImage;
    }

    public Integer getFollowers() {
        return followers;
    }

    public void setFollowers(Integer followers) {
        this.followers = followers;
    }

    public Integer getFollowing() {
        return following;
    }

    public void setFollowing(Integer following) {
        this.following = following;
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
        private String email;
        private Role role;
        private boolean enabled;
        private Date birthDate;
        private String bio;
        private Integer readerScore;
        private Integer booksRead;
        private String profileImage;
        private String headerImage;
        private Integer followers;
        private Integer following;

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

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public UserBuilder enabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public UserBuilder birthDate(Date birthDate) {
            this.birthDate = birthDate;
            return this;
        }

        public UserBuilder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public UserBuilder readerScore(Integer readerScore) {
            this.readerScore = readerScore;
            return this;
        }

        public UserBuilder booksRead(Integer booksRead) {
            this.booksRead = booksRead;
            return this;
        }

        public UserBuilder profileImage(String profileImage) {
            this.profileImage = profileImage;
            return this;
        }

        public UserBuilder headerImage(String headerImage) {
            this.headerImage = headerImage;
            return this;
        }

        public UserBuilder followers(Integer followers) {
            this.followers = followers;
            return this;
        }

        public UserBuilder following(Integer following) {
            this.following = following;
            return this;
        }

        public User build() {
            User user = new User();
            user.id = this.id;
            user.nameSurname = this.nameSurname;
            user.username = this.username;
            user.password = this.password;
            user.email = this.email;
            user.role = this.role;
            user.enabled = this.enabled;
            user.birthDate = this.birthDate;
            user.bio = this.bio;
            user.readerScore = this.readerScore;
            user.booksRead = this.booksRead;
            user.profileImage = this.profileImage;
            user.headerImage = this.headerImage;
            user.followers = this.followers;
            user.following = this.following;
            return user;
        }

        public String toString() {
            return "User.UserBuilder(id=" + this.id + ", nameSurname=" + this.nameSurname + ", username=" + this.username + ", password=" + this.password + ", role=" + this.role + ", enabled=" + this.enabled + ", birthDate=" + this.birthDate + ", bio=" + this.bio + ", readerScore=" + this.readerScore + ", booksRead=" + this.booksRead + ", profileImage=" + this.profileImage + ", headerImage=" + this.headerImage + ", followers=" + this.followers + ", following=" + this.following + ")";
        }
    }
}
