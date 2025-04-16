package aybu.graduationproject.okuyorum.user.service;

import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import aybu.graduationproject.okuyorum.user.enums.Role;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public boolean isAdmin() {
        User currentUser = getCurrentUser();
        return currentUser.getRole() == Role.ADMIN;
    }

    public List<User> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        return userRepository.searchUsers(query.trim());
    }

    public List<User> quickSearchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        return userRepository.findByUsernameStartingWithIgnoreCaseOrNameSurnameStartingWithIgnoreCaseOrderById(query.trim());
    }

    public Long getUserIdByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"))
                .getId();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public Long findUserIdByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username))
                .getId();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
} 