package aybu.graduationproject.okuyorum.milletKiraathaneleri.controller;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.KiraathaneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kiraathanes")
@RequiredArgsConstructor
public class KiraathaneController {

    private final KiraathaneService kiraathaneService;

    @GetMapping
    public ResponseEntity<List<KiraathaneDTO>> getAllKiraathanes() {
        return ResponseEntity.ok(kiraathaneService.getAllKiraathanes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KiraathaneDTO> getKiraathaneById(@PathVariable Long id) {
        return ResponseEntity.ok(kiraathaneService.getKiraathaneById(id));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<KiraathaneDTO>> getKiraathanesByCity(@PathVariable String city) {
        return ResponseEntity.ok(kiraathaneService.getKiraathanesByCity(city));
    }

    @GetMapping("/city/{city}/district/{district}")
    public ResponseEntity<List<KiraathaneDTO>> getKiraathanesByCityAndDistrict(
            @PathVariable String city,
            @PathVariable String district) {
        return ResponseEntity.ok(kiraathaneService.getKiraathanesByCityAndDistrict(city, district));
    }

    @PostMapping
    public ResponseEntity<KiraathaneDTO> createKiraathane(@RequestBody KiraathaneDTO kiraathaneDTO) {
        return new ResponseEntity<>(kiraathaneService.createKiraathane(kiraathaneDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KiraathaneDTO> updateKiraathane(
            @PathVariable Long id,
            @RequestBody KiraathaneDTO kiraathaneDTO) {
        return ResponseEntity.ok(kiraathaneService.updateKiraathane(id, kiraathaneDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKiraathane(@PathVariable Long id) {
        kiraathaneService.deleteKiraathane(id);
        return ResponseEntity.noContent().build();
    }
} 