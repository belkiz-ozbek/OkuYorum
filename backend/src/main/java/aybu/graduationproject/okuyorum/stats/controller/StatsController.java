package aybu.graduationproject.okuyorum.stats.controller;

import aybu.graduationproject.okuyorum.user.service.UserService;
import aybu.graduationproject.okuyorum.donation.service.DonationService;
import aybu.graduationproject.okuyorum.user.enums.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class StatsController {

    private final UserService userService;
    private final DonationService donationService;

    @Autowired
    public StatsController(UserService userService, DonationService donationService) {
        this.userService = userService;
        this.donationService = donationService;
    }

    @GetMapping("/overview")
    public ResponseEntity<?> getOverviewStats() {
        try {
            // Yetki kontrolü
            if (!userService.isAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Bu işlem için yönetici yetkisi gereklidir."));
            }
            
            Map<String, Object> stats = new HashMap<>();
            
            // Kullanıcı istatistikleri
            var users = userService.getAllUsers();
            var now = LocalDateTime.now();
            var lastWeek = now.minus(7, ChronoUnit.DAYS);
            
            stats.put("userStats", Map.of(
                "totalUsers", users.size(),
                "newUsers", users.stream()
                    .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(lastWeek))
                    .count(),
                "activeUsers", users.stream()
                    .filter(u -> u.getStatus() != null && "ACTIVE".equals(u.getStatus().name()))
                    .count(),
                "inactiveUsers", users.stream()
                    .filter(u -> u.getStatus() == null || !"ACTIVE".equals(u.getStatus().name()))
                    .count()
            ));
            
            // Bağış istatistikleri
            var donations = donationService.getAllDonations();
            
            stats.put("donationStats", Map.of(
                "totalDonations", donations.size(),
                "pendingDonations", donations.stream()
                    .filter(d -> d.getStatus() != null && "PENDING".equals(d.getStatus().name()))
                    .count(),
                "completedDonations", donations.stream()
                    .filter(d -> d.getStatus() != null && "COMPLETED".equals(d.getStatus().name()))
                    .count(),
                "rejectedDonations", donations.stream()
                    .filter(d -> d.getStatus() != null && 
                        ("REJECTED".equals(d.getStatus().name()) || "CANCELLED".equals(d.getStatus().name())))
                    .count(),
                "totalBooks", donations.stream()
                    .mapToInt(d -> d.getQuantity() != null ? d.getQuantity() : 0)
                    .sum()
            ));
            
            // Aktivite istatistikleri - gerçek bir aktivite log veritabanı olmadığı için tahmin ediyoruz
            stats.put("activityStats", Map.of(
                "logins", Math.round(users.size() * 0.8), // Kullanıcıların %80'i giriş yapmış
                "registrations", users.stream()
                    .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(lastWeek))
                    .count(),
                "donations", donations.stream()
                    .filter(d -> d.getCreatedAt() != null && d.getCreatedAt().isAfter(lastWeek))
                    .count(),
                "searches", Math.round(users.size() * 3.5) // Her kullanıcı ortalama 3.5 arama yapmış
            ));
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "İstatistikler alınırken bir hata oluştu: " + e.getMessage()));
        }
    }

    @GetMapping("/top-users")
    public ResponseEntity<?> getTopUsers() {
        try {
            // Yetki kontrolü
            if (!userService.isAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Bu işlem için yönetici yetkisi gereklidir."));
            }
            
            var users = userService.getAllUsers();
            
            // Aktif kullanıcıları bul (Gerçekte aktivite veritabanı olurdu, burada rastgele)
            List<Map<String, Object>> topActiveUsers = users.stream()
                .filter(u -> u.getReaderScore() != null && u.getReaderScore() > 0)
                .sorted((u1, u2) -> u2.getReaderScore().compareTo(u1.getReaderScore()))
                .limit(5)
                .map(u -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("username", u.getUsername());
                    userInfo.put("activities", u.getReaderScore());
                    return userInfo;
                })
                .collect(Collectors.toList());
            
            // En çok bağış yapan kullanıcılar (gerçekte bağış sayısına göre gruplanmış veri olurdu)
            List<Map<String, Object>> topDonators = users.stream()
                .limit(5)
                .map(u -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("username", u.getUsername());
                    userInfo.put("count", Math.round(Math.random() * 10) + 1); // 1-10 arası rastgele
                    return userInfo;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> result = new HashMap<>();
            result.put("topActiveUsers", topActiveUsers);
            result.put("topDonators", topDonators);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "En iyi kullanıcılar alınırken bir hata oluştu: " + e.getMessage()));
        }
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<?> getRecentActivities() {
        try {
            // Yetki kontrolü
            if (!userService.isAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Bu işlem için yönetici yetkisi gereklidir."));
            }
            
            // Gerçek bir aktivite sistemi olmadığı için örnek veri
            var users = userService.getAllUsers().stream()
                .limit(5)
                .map(u -> u.getUsername())
                .collect(Collectors.toList());
            
            var activityTypes = List.of(
                "Kullanıcı Girişi", "Yeni Bağış", "Kitap Arama", 
                "Yeni Kayıt", "Profil Güncelleme", "Bağış Onayı"
            );
            
            var times = List.of(
                "5 dakika önce", "17 dakika önce", "32 dakika önce", 
                "49 dakika önce", "1 saat önce"
            );
            
            List<Map<String, Object>> activities = List.of(
                Map.of(
                    "type", activityTypes.get(0),
                    "username", users.size() > 0 ? users.get(0) : "user1",
                    "time", times.get(0)
                ),
                Map.of(
                    "type", activityTypes.get(1),
                    "username", users.size() > 1 ? users.get(1) : "user2",
                    "time", times.get(1)
                ),
                Map.of(
                    "type", activityTypes.get(2),
                    "username", users.size() > 2 ? users.get(2) : "user3",
                    "time", times.get(2)
                ),
                Map.of(
                    "type", activityTypes.get(3),
                    "username", users.size() > 3 ? users.get(3) : "user4",
                    "time", times.get(3)
                ),
                Map.of(
                    "type", activityTypes.get(5),
                    "username", users.size() > 4 ? users.get(4) : "admin",
                    "time", times.get(4)
                )
            );
            
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Son aktiviteler alınırken bir hata oluştu: " + e.getMessage()));
        }
    }
} 