package aybu.graduationproject.okuyorum.signup.entity;

import aybu.graduationproject.okuyorum.signup.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
