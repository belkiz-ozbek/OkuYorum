package aybu.graduationproject.okuyorum.signup.dto;

public class VerificationRequest {
    private String verificationCode;
    private Long tokenId;

    // Default constructor
    public VerificationRequest() {
    }

    // All args constructor
    public VerificationRequest(String verificationCode, Long tokenId) {
        this.verificationCode = verificationCode;
        this.tokenId = tokenId;
    }

    // Getters and Setters
    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public Long getTokenId() {
        return tokenId;
    }

    public void setTokenId(Long tokenId) {
        this.tokenId = tokenId;
    }
} 