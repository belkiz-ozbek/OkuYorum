package aybu.graduationproject.okuyorum.signup.service;

import aybu.graduationproject.okuyorum.signup.entity.User;
import aybu.graduationproject.okuyorum.signup.repository.UserRepository;
import aybu.graduationproject.okuyorum.signup.enums.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
    
    /**
     * Checks if the current user has the ADMIN role
     * @return true if the user is an admin, false otherwise
     */
    public boolean isAdmin() {
        User currentUser = getCurrentUser();
        return currentUser.getRole() == Role.ADMIN;
    }
}