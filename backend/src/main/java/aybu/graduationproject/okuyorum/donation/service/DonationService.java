package aybu.graduationproject.okuyorum.donation.service;

import aybu.graduationproject.okuyorum.donation.dto.DonationDto;
import aybu.graduationproject.okuyorum.donation.entity.Donation;
import aybu.graduationproject.okuyorum.donation.entity.DonationStatus;
import aybu.graduationproject.okuyorum.donation.repository.DonationRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import aybu.graduationproject.okuyorum.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import aybu.graduationproject.okuyorum.donation.mapper.DonationMapper;
import aybu.graduationproject.okuyorum.common.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class DonationService {
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final UserService userService;
    private final DonationMapper donationMapper;
    private static final Logger log = LoggerFactory.getLogger(DonationService.class);

    @Autowired
    public DonationService(
        DonationRepository donationRepository,
        UserRepository userRepository,
        EmailService emailService,
        UserService userService,
        DonationMapper donationMapper
    ) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.userService = userService;
        this.donationMapper = donationMapper;
    }

    public DonationDto createDonation(DonationDto donationDto) {
        try {
            User user = userService.getCurrentUser();
            Donation donation = donationMapper.toEntity(donationDto);
            donation.setUser(user);
            donation.setStatus(DonationStatus.PENDING);
            donation.setCreatedAt(LocalDateTime.now());
            
            Donation savedDonation = donationRepository.save(donation);
            
            // Email bildirimleri - hata durumunda işlemi kesmesin
            try {
                emailService.sendDonationConfirmationEmail(user.getEmail(), savedDonation);
                if (donation.getDonationType().equals("schools") || 
                    donation.getDonationType().equals("libraries")) {
                    emailService.sendInstitutionNotificationEmail(savedDonation);
                }
            } catch (Exception e) {
                // Email gönderimi başarısız olsa bile bağış kaydedildi
                log.error("Email gönderimi sırasında hata: " + e.getMessage());
            }
            
            return donationMapper.toDto(savedDonation);
        } catch (Exception e) {
            throw new RuntimeException("Bağış kaydedilirken bir hata oluştu: " + e.getMessage());
        }
    }

    public List<DonationDto> getAllDonations() {
        List<Donation> donations = donationRepository.findAll();
        return donations.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public List<DonationDto> getMyDonations() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Donation> donations = donationRepository.findByUser(user);
        return donations.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    private DonationDto convertToDto(Donation donation) {
        DonationDto dto = new DonationDto();
        dto.setId(donation.getId());
        if (donation.getUser() != null) {
            dto.setUserId(donation.getUser().getId());
        }
        dto.setBookTitle(donation.getBookTitle());
        dto.setAuthor(donation.getAuthor());
        dto.setGenre(donation.getGenre());
        dto.setCondition(donation.getCondition());
        dto.setQuantity(donation.getQuantity());
        dto.setDescription(donation.getDescription());
        dto.setLatitude(donation.getLatitude());
        dto.setLongitude(donation.getLongitude());
        dto.setInstitutionName(donation.getInstitutionName());
        dto.setRecipientName(donation.getRecipientName());
        dto.setAddress(donation.getAddress());
        dto.setDonationType(donation.getDonationType());
        dto.setCreatedAt(donation.getCreatedAt());
        dto.setStatus(donation.getStatus());
        
        // Takip bilgileri
        dto.setStatusUpdatedAt(donation.getStatusUpdatedAt());
        dto.setStatusNote(donation.getStatusNote());
        dto.setTrackingCode(donation.getTrackingCode());
        dto.setDeliveryMethod(donation.getDeliveryMethod());
        dto.setEstimatedDeliveryDate(donation.getEstimatedDeliveryDate());
        dto.setHandlerName(donation.getHandlerName());
        
        return dto;
    }

    // İstatistik metodları
    public Map<String, Long> getDonationStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", donationRepository.count());
        stats.put("schools", donationRepository.countByDonationType("schools"));
        stats.put("libraries", donationRepository.countByDonationType("libraries"));
        stats.put("individual", donationRepository.countByDonationType("individual"));
        return stats;
    }
    
    /**
     * Bağış durumunu günceller ve ilgili takip bilgilerini ekler
     */
    @Transactional
    public DonationDto updateDonationStatus(Long donationId, DonationStatus newStatus, String statusNote) {
        Donation donation = donationRepository.findById(donationId)
            .orElseThrow(() -> new RuntimeException("Bağış bulunamadı: " + donationId));
        
        // Yetki kontrolü
        User currentUser = userService.getCurrentUser();
        if (!donation.getUser().getId().equals(currentUser.getId()) && !userService.isAdmin()) {
            throw new RuntimeException("Bu bağışı güncelleme yetkiniz yok");
        }
        
        donation.setStatus(newStatus);
        donation.setStatusNote(statusNote);
        donation.setStatusUpdatedAt(LocalDateTime.now());
        
        // Durum değişikliğine göre email bildirimleri gönder
        try {
            emailService.sendDonationStatusUpdateEmail(donation.getUser().getEmail(), donation);
        } catch (Exception e) {
            log.error("Durum güncelleme emaili gönderilemedi: " + e.getMessage());
        }
        
        return donationMapper.toDto(donationRepository.save(donation));
    }
    
    /**
     * Bağış takip bilgilerini günceller
     */
    @Transactional
    public DonationDto updateDonationTracking(Long donationId, DonationDto trackingInfo) {
        Donation donation = donationRepository.findById(donationId)
            .orElseThrow(() -> new RuntimeException("Bağış bulunamadı: " + donationId));
        
        // Yetki kontrolü - sadece admin kullanıcılar takip bilgilerini güncelleyebilir
        if (!userService.isAdmin()) {
            throw new RuntimeException("Takip bilgilerini güncelleme yetkiniz yok");
        }
        
        if (trackingInfo.getTrackingCode() != null) {
            donation.setTrackingCode(trackingInfo.getTrackingCode());
        }
        
        if (trackingInfo.getDeliveryMethod() != null) {
            donation.setDeliveryMethod(trackingInfo.getDeliveryMethod());
        }
        
        if (trackingInfo.getEstimatedDeliveryDate() != null) {
            donation.setEstimatedDeliveryDate(trackingInfo.getEstimatedDeliveryDate());
        }
        
        if (trackingInfo.getHandlerName() != null) {
            donation.setHandlerName(trackingInfo.getHandlerName());
        }
        
        donation.setStatusUpdatedAt(LocalDateTime.now());
        
        // Takip bilgileri güncellendiğinde email bildirimi gönder
        try {
            emailService.sendDonationTrackingUpdateEmail(donation.getUser().getEmail(), donation);
        } catch (Exception e) {
            log.error("Takip bilgileri güncelleme emaili gönderilemedi: " + e.getMessage());
        }
        
        return donationMapper.toDto(donationRepository.save(donation));
    }
    
    /**
     * Belirli bir bağışın detaylı bilgilerini getirir
     */
    public DonationDto getDonationDetails(Long donationId) {
        Donation donation = donationRepository.findById(donationId)
            .orElseThrow(() -> new RuntimeException("Bağış bulunamadı: " + donationId));
        
        // Yetki kontrolü
        User currentUser = userService.getCurrentUser();
        if (!donation.getUser().getId().equals(currentUser.getId()) && !userService.isAdmin()) {
            throw new RuntimeException("Bu bağışın detaylarını görüntüleme yetkiniz yok");
        }
        
        return donationMapper.toDto(donation);
    }
    
    /**
     * Bağış durumuna göre tahmini teslim süresi hesaplar
     */
    public LocalDateTime calculateEstimatedDeliveryDate(DonationStatus status, String donationType) {
        LocalDateTime now = LocalDateTime.now();
        
        // Bağış türüne ve durumuna göre tahmini süre hesapla
        switch (status) {
            case APPROVED:
                return now.plusDays(2); // Onaylandıktan 2 gün sonra hazırlanmış olur
            case PREPARING:
                return now.plusDays(3); // Hazırlanmaya başladıktan 3 gün sonra teslimata hazır olur
            case READY_FOR_PICKUP:
                return now.plusDays(1); // Teslimata hazır olduktan 1 gün sonra taşınmaya başlar
            case IN_TRANSIT:
                // Bağış türüne göre taşıma süresi değişir
                if ("schools".equals(donationType)) {
                    return now.plusDays(5); // Okullara 5 gün içinde ulaşır
                } else if ("libraries".equals(donationType)) {
                    return now.plusDays(4); // Kütüphanelere 4 gün içinde ulaşır
                } else {
                    return now.plusDays(3); // Bireylere 3 gün içinde ulaşır
                }
            default:
                return now.plusWeeks(1); // Varsayılan olarak 1 hafta
        }
    }
} 