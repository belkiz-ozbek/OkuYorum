package aybu.graduationproject.okuyorum.donation.controller;

import aybu.graduationproject.okuyorum.donation.dto.DonationRequestDto;
import aybu.graduationproject.okuyorum.donation.entity.RequestStatus;
import aybu.graduationproject.okuyorum.donation.entity.RequestType;
import aybu.graduationproject.okuyorum.donation.service.DonationRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class DonationRequestController {
    
    private final DonationRequestService requestService;
    
    @Autowired
    public DonationRequestController(DonationRequestService requestService) {
        this.requestService = requestService;
    }
    
    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody DonationRequestDto requestDto) {
        try {
            DonationRequestDto createdRequest = requestService.createRequest(requestDto);
            return ResponseEntity.ok()
                    .body(new HashMap<String, Object>() {{
                        put("message", "Bağış talebi başarıyla oluşturuldu");
                        put("request", createdRequest);
                    }});
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HashMap<String, String>() {{
                        put("error", "Bağış talebi oluşturulurken bir hata oluştu: " + e.getMessage());
                    }});
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllRequests(
            @RequestParam(required = false) RequestType type,
            @RequestParam(required = false) String genre) {
        try {
            List<DonationRequestDto> requests;
            if (type != null || genre != null) {
                requests = requestService.getActiveRequests(type, genre);
            } else {
                requests = requestService.getAllRequests();
            }
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HashMap<String, String>() {{
                        put("error", "Talepler listelenirken bir hata oluştu: " + e.getMessage());
                    }});
        }
    }
    
    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyRequests() {
        try {
            List<DonationRequestDto> requests = requestService.getMyRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HashMap<String, String>() {{
                        put("error", "Talepleriniz listelenirken bir hata oluştu: " + e.getMessage());
                    }});
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestDetails(@PathVariable Long id) {
        try {
            DonationRequestDto request = requestService.getRequestDetails(id);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HashMap<String, String>() {{
                        put("error", "Talep detayları alınırken bir hata oluştu: " + e.getMessage());
                    }});
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String statusStr = statusUpdate.get("status");
            if (statusStr == null) {
                return ResponseEntity.badRequest()
                        .body(new HashMap<String, String>() {{
                            put("error", "Durum bilgisi gereklidir");
                        }});
            }
            
            RequestStatus newStatus;
            try {
                newStatus = RequestStatus.valueOf(statusStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(new HashMap<String, String>() {{
                            put("error", "Geçersiz durum değeri: " + statusStr);
                        }});
            }
            
            DonationRequestDto updatedRequest = requestService.updateRequestStatus(id, newStatus);
            return ResponseEntity.ok(updatedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HashMap<String, String>() {{
                        put("error", "Talep durumu güncellenirken bir hata oluştu: " + e.getMessage());
                    }});
        }
    }
} 