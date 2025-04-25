package aybu.graduationproject.okuyorum.user.service;

import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import aybu.graduationproject.okuyorum.user.enums.Role;
import aybu.graduationproject.okuyorum.profile.service.AchievementService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AchievementService achievementService;

    @Autowired
    public UserService(UserRepository userRepository, AchievementService achievementService) {
        this.userRepository = userRepository;
        this.achievementService = achievementService;
    }

    @Transactional
    public User createUser(User user) {
        User savedUser = userRepository.save(user);
        achievementService.initializeAchievements(savedUser.getId());
        return savedUser;
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
                .map(User::getId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + username));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void updateYearlyGoal(Long userId, Integer yearlyGoal) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));
        
        user.setYearlyGoal(yearlyGoal);
        userRepository.save(user);
    }
}