package aybu.graduationproject.okuyorum.donation.controller;

import aybu.graduationproject.okuyorum.donation.dto.DonationTrackingDto;
import aybu.graduationproject.okuyorum.donation.entity.DonationStatus;
import aybu.graduationproject.okuyorum.donation.service.DonationTrackingService;
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
public class DonationTrackingController {

    private final DonationTrackingService trackingService;

    @Autowired
    public DonationTrackingController(DonationTrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @GetMapping("/{donationId}/tracking")
    public ResponseEntity<?> getDonationTrackingHistory(@PathVariable Long donationId) {
        try {
            List<DonationTrackingDto> trackingHistory = trackingService.getDonationTrackingHistory(donationId);
            return ResponseEntity.ok(trackingHistory);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HashMap<String, String>() {{
                        put("error", "Bağış takip geçmişi alınırken bir hata oluştu: " + e.getMessage());
                    }});
        }
    }

    @PostMapping("/{donationId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDonationStatus(
            @PathVariable Long donationId,
            @RequestBody Map<String, Object> statusUpdate) {
        try {
            String statusStr = (String) statusUpdate.get("status");
            String notes = (String) statusUpdate.get("notes");
            
            if (statusStr == null) {
                return ResponseEntity.badRequest()
                        .body(new HashMap<String, String>() {{
                            put("error", "Durum bilgisi gereklidir");
                        }});
            }
            
            DonationStatus newStatus;
            try {
                newStatus = DonationStatus.valueOf(statusStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(new HashMap<String, String>() {{
                            put("error", "Geçersiz durum değeri: " + statusStr);
                        }});
            }
            
            DonationTrackingDto trackingRecord = trackingService.updateDonationStatus(donationId, newStatus, notes);
            return ResponseEntity.ok()
                    .body(new HashMap<String, Object>() {{
                        put("message", "Bağış durumu başarıyla güncellendi");
                        put("tracking", trackingRecord);
                    }});
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HashMap<String, String>() {{
                        put("error", "Bağış durumu güncellenirken bir hata oluştu: " + e.getMessage());
                    }});
        }
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDonationStatistics() {
        try {
            Map<String, Object> statistics = trackingService.getDonationStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HashMap<String, String>() {{
                        put("error", "Bağış istatistikleri alınırken bir hata oluştu: " + e.getMessage());
                    }});
        }
    }
} 