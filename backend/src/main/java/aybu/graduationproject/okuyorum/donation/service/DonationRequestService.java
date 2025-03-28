package aybu.graduationproject.okuyorum.donation.service;

import aybu.graduationproject.okuyorum.donation.dto.DonationRequestDto;
import aybu.graduationproject.okuyorum.donation.entity.DonationRequest;
import aybu.graduationproject.okuyorum.donation.entity.RequestStatus;
import aybu.graduationproject.okuyorum.donation.entity.RequestType;
import aybu.graduationproject.okuyorum.donation.mapper.DonationRequestMapper;
import aybu.graduationproject.okuyorum.donation.repository.DonationRequestRepository;
import aybu.graduationproject.okuyorum.signup.entity.User;
import aybu.graduationproject.okuyorum.signup.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationRequestService {
    
    private static final Logger logger = LoggerFactory.getLogger(DonationRequestService.class);
    
    private final DonationRequestRepository requestRepository;
    private final DonationRequestMapper requestMapper;
    private final UserService userService;
    
    @Autowired
    public DonationRequestService(
            DonationRequestRepository requestRepository,
            DonationRequestMapper requestMapper,
            UserService userService) {
        this.requestRepository = requestRepository;
        this.requestMapper = requestMapper;
        this.userService = userService;
    }
    
    @Transactional
    public DonationRequestDto createRequest(DonationRequestDto requestDto) {
        try {
            User currentUser = userService.getCurrentUser();
            
            DonationRequest request = requestMapper.toEntity(requestDto);
            request.setRequester(currentUser);
            request.setStatus(RequestStatus.PENDING);
            
            DonationRequest savedRequest = requestRepository.save(request);
            return requestMapper.toDto(savedRequest);
        } catch (Exception e) {
            logger.error("Bağış talebi oluşturulurken hata: " + e.getMessage());
            throw new RuntimeException("Bağış talebi oluşturulamadı: " + e.getMessage());
        }
    }
    
    public List<DonationRequestDto> getAllRequests() {
        return requestRepository.findAll().stream()
                .map(requestMapper::toDto)
                .collect(Collectors.toList());
    }
    
    public List<DonationRequestDto> getMyRequests() {
        User currentUser = userService.getCurrentUser();
        return requestRepository.findByRequester(currentUser).stream()
                .map(requestMapper::toDto)
                .collect(Collectors.toList());
    }
    
    public List<DonationRequestDto> getActiveRequests(RequestType type, String genre) {
        return requestRepository.findActiveRequests(type, genre).stream()
                .map(requestMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public DonationRequestDto updateRequestStatus(Long requestId, RequestStatus newStatus) {
        DonationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Bağış talebi bulunamadı: " + requestId));
        
        // Yetki kontrolü
        User currentUser = userService.getCurrentUser();
        if (!request.getRequester().getId().equals(currentUser.getId()) && !userService.isAdmin()) {
            throw new RuntimeException("Bu talebi güncelleme yetkiniz yok");
        }
        
        request.setStatus(newStatus);
        return requestMapper.toDto(requestRepository.save(request));
    }
    
    public DonationRequestDto getRequestDetails(Long requestId) {
        DonationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Bağış talebi bulunamadı: " + requestId));
        return requestMapper.toDto(request);
    }
} 