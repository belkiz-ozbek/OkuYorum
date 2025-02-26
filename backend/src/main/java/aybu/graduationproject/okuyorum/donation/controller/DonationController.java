package aybu.graduationproject.okuyorum.donation.controller;

import aybu.graduationproject.okuyorum.donation.dto.DonationDto;
import aybu.graduationproject.okuyorum.donation.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('USER')")
public class DonationController {
    private final DonationService donationService;

    @Autowired
    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public ResponseEntity<?> createDonation(@RequestBody DonationDto donationDto) {
        try {
            donationService.createDonation(donationDto);
            return ResponseEntity.ok()
                .body(new HashMap<String, String>() {{
                    put("message", "Bağış başarıyla kaydedildi");
                }});
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new HashMap<String, String>() {{
                    put("error", "Bağış kaydedilirken bir hata oluştu: " + e.getMessage());
                }});
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllDonations() {
        try {
            List<DonationDto> donations = donationService.getAllDonations();
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new HashMap<String, String>() {{
                    put("error", "Bağışlar listelenirken bir hata oluştu: " + e.getMessage());
                }});
        }
    }

    @GetMapping("/my-donations")
    public ResponseEntity<?> getMyDonations() {
        try {
            List<DonationDto> donations = donationService.getMyDonations();
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new HashMap<String, String>() {{
                    put("error", "Bağışlarınız listelenirken bir hata oluştu: " + e.getMessage());
                }});
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getDonationStats() {
        try {
            Map<String, Long> stats = donationService.getDonationStats();
            
            // Frontend'in beklediği formata dönüştür
            Map<String, Object> formattedStats = new HashMap<>();
            formattedStats.put("totalDonations", stats.get("total"));
            
            // Toplam alıcı sayısını hesapla (şimdilik bağış sayısının %80'i olarak varsayalım)
            long totalRecipients = Math.round(stats.get("total") * 0.8);
            formattedStats.put("totalRecipients", totalRecipients);
            
            // Diğer istatistikleri de ekle
            formattedStats.put("schoolDonations", stats.get("schools"));
            formattedStats.put("libraryDonations", stats.get("libraries"));
            formattedStats.put("individualDonations", stats.get("individual"));
            
            return ResponseEntity.ok(formattedStats);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new HashMap<String, String>() {{
                    put("error", "İstatistikler alınırken bir hata oluştu: " + e.getMessage());
                }});
        }
    }
} 