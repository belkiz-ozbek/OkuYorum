package aybu.graduationproject.okuyorum.profile.service;

import aybu.graduationproject.okuyorum.user.entity.ReadingActivity;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.ReadingActivityRepository;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import aybu.graduationproject.okuyorum.profile.entity.Achievement;
import aybu.graduationproject.okuyorum.profile.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ProfileService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private ReadingActivityRepository readingActivityRepository;

    @Transactional(readOnly = true)
    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
    }

    @Transactional
    public User updateUserProfile(Long userId, User updatedUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (updatedUser.getNameSurname() != null) {
            user.setNameSurname(updatedUser.getNameSurname());
        }
        if (updatedUser.getBio() != null) {
            user.setBio(updatedUser.getBio());
        }
        if (updatedUser.getBirthDate() != null) {
            user.setBirthDate(updatedUser.getBirthDate());
        }

        return userRepository.save(user);
    }

    @Transactional
    public User updateProfileImage(Long userId, MultipartFile file) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            String fileName = saveFile(file, "profile");
            
            if (user.getProfileImage() != null) {
                deleteFile(user.getProfileImage());
            }
            
            user.setProfileImage(fileName);
            return userRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Profil fotoğrafı yüklenirken hata oluştu", e);
        }
    }

    @Transactional
    public User updateHeaderImage(Long userId, MultipartFile file) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            String fileName = saveFile(file, "header");
            
            if (user.getHeaderImage() != null) {
                deleteFile(user.getHeaderImage());
            }
            
            user.setHeaderImage(fileName);
            return userRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Kapak fotoğrafı yüklenirken hata oluştu", e);
        }
    }

    private String saveFile(MultipartFile file, String prefix) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String fileName = prefix + "-" + UUID.randomUUID().toString() + extension;
        
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        
        return fileName;
    }

    private void deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Transactional(readOnly = true)
    public List<Achievement> getUserAchievements(Long userId) {
        User user = getUserProfile(userId);
        return achievementRepository.findByUserIdOrderByProgressDesc(userId);
    }

    @Transactional
    public Achievement updateAchievementProgress(Long userId, Long achievementId, Integer progress) {
        User user = getUserProfile(userId);
        Achievement achievement = achievementRepository.findByIdAndUserId(achievementId, userId)
                .orElseThrow(() -> new RuntimeException("Başarı bulunamadı"));

        achievement.setProgress(progress);
        return achievementRepository.save(achievement);
    }

    @Transactional(readOnly = true)
    public List<ReadingActivity> getUserReadingActivity(Long userId) {
        User user = getUserProfile(userId);
        return readingActivityRepository.findByUserOrderByMonthDesc(user);
    }

    @Transactional
    public ReadingActivity addReadingActivity(Long userId, String month, Integer books) {
        User user = getUserProfile(userId);
        
        ReadingActivity activity = new ReadingActivity();
        activity.setUser(user);
        activity.setMonth(month);
        activity.setBooks(books);
        
        return readingActivityRepository.save(activity);
    }

    @Transactional
    public User updateYearlyGoal(Long userId, Integer goal) {
        User user = getUserProfile(userId);
        user.setYearlyGoal(goal);
        return userRepository.save(user);
    }
} 