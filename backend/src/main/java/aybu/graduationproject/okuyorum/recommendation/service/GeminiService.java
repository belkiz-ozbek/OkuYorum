package aybu.graduationproject.okuyorum.recommendation.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class GeminiService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=";

    public String getRecommendation(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = apiUrl + apiKey;

            String requestBody = String.format(
                "{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}],\"generationConfig\":{\"temperature\":0.7,\"topK\":40,\"topP\":0.95,\"maxOutputTokens\":1024}}",
                prompt.replace("\"", "\\\"")
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.has("candidates") && root.get("candidates").size() > 0) {
                    JsonNode content = root.get("candidates").get(0).get("content");
                    if (content != null && content.has("parts") && content.get("parts").size() > 0) {
                        return content.get("parts").get(0).get("text").asText();
                    }
                }
            }
            
            logger.error("Unexpected response format from Gemini API: {}", response.getBody());
            return "Üzgünüm, şu anda kitap önerisi oluşturulamıyor. Lütfen daha sonra tekrar deneyin.";
            
        } catch (HttpClientErrorException e) {
            logger.error("Error calling Gemini API: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
        } catch (Exception e) {
            logger.error("Unexpected error in getRecommendation", e);
            return "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
        }
    }
} 