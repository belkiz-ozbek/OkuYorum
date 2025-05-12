package aybu.graduationproject.okuyorum.milletKiraathaneleri.controller;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneRatingDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.KiraathaneRatingService;
import aybu.graduationproject.okuyorum.security.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kiraathane-ratings")
@RequiredArgsConstructor
public class KiraathaneRatingController {

    private final KiraathaneRatingService ratingService;
    private final JwtService jwtService;

    @PostMapping("/kiraathane/{kiraathaneId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<KiraathaneRatingDTO> addRating(
            @PathVariable Long kiraathaneId,
            @RequestBody KiraathaneRatingDTO ratingDTO) {
        Long userId = jwtService.getCurrentUserId();
        return new ResponseEntity<>(ratingService.addRating(kiraathaneId, userId, ratingDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{ratingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<KiraathaneRatingDTO> updateRating(
            @PathVariable Long ratingId,
            @RequestBody KiraathaneRatingDTO ratingDTO) {
        Long userId = jwtService.getCurrentUserId();
        return ResponseEntity.ok(ratingService.updateRating(ratingId, userId, ratingDTO));
    }

    @DeleteMapping("/{ratingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteRating(@PathVariable Long ratingId) {
        Long userId = jwtService.getCurrentUserId();
        ratingService.deleteRating(ratingId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{ratingId}")
    public ResponseEntity<KiraathaneRatingDTO> getRatingById(@PathVariable Long ratingId) {
        return ResponseEntity.ok(ratingService.getRatingById(ratingId));
    }

    @GetMapping("/kiraathane/{kiraathaneId}")
    public ResponseEntity<List<KiraathaneRatingDTO>> getRatingsByKiraathaneId(@PathVariable Long kiraathaneId) {
        return ResponseEntity.ok(ratingService.getRatingsByKiraathaneId(kiraathaneId));
    }

    @GetMapping("/kiraathane/{kiraathaneId}/paged")
    public ResponseEntity<Page<KiraathaneRatingDTO>> getPagedRatingsByKiraathaneId(
            @PathVariable Long kiraathaneId,
            Pageable pageable) {
        return ResponseEntity.ok(ratingService.getRatingsByKiraathaneId(kiraathaneId, pageable));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<KiraathaneRatingDTO>> getRatingsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getRatingsByUserId(userId));
    }

    @GetMapping("/kiraathane/{kiraathaneId}/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<KiraathaneRatingDTO> getUserRatingForKiraathane(@PathVariable Long kiraathaneId) {
        Long userId = jwtService.getCurrentUserId();
        KiraathaneRatingDTO rating = ratingService.getUserRatingForKiraathane(kiraathaneId, userId);
        return rating != null ? ResponseEntity.ok(rating) : ResponseEntity.notFound().build();
    }

    @GetMapping("/kiraathane/{kiraathaneId}/has-rated")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> hasUserRatedKiraathane(@PathVariable Long kiraathaneId) {
        Long userId = jwtService.getCurrentUserId();
        return ResponseEntity.ok(ratingService.hasUserRatedKiraathane(kiraathaneId, userId));
    }
} 