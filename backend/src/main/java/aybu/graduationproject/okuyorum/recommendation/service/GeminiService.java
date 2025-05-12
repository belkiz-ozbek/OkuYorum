package aybu.graduationproject.okuyorum.recommendation.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
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

    @Value("${gemini.temperature:0.7}")
    private double temperature;

    @Value("${gemini.max_output_tokens:1024}")
    private int maxOutputTokens;

    private final String apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=";

    @Retryable(
        value = {HttpClientErrorException.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000)
    )
    public String getRecommendation(String prompt) {
        try {
            logger.info("Sending request to Gemini API with prompt length: {}", prompt.length());
            RestTemplate restTemplate = new RestTemplate();
            String url = apiUrl + apiKey;

            String requestBody = buildRequestBody(prompt);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return parseGeminiResponse(response.getBody());
            }
            
            logger.error("Unexpected response format from Gemini API: {}", response.getBody());
            return getFallbackResponse();
            
        } catch (HttpClientErrorException e) {
            logger.error("Error calling Gemini API: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e; // Let @Retryable handle it
        } catch (Exception e) {
            logger.error("Unexpected error in getRecommendation", e);
            return getFallbackResponse();
        }
    }

    private String buildRequestBody(String prompt) {
        return String.format(
            "{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}],\"generationConfig\":{\"temperature\":%f,\"maxOutputTokens\":%d,\"topK\":40,\"topP\":0.95,\"candidateCount\":1}}",
            prompt.replace("\"", "\\\""),
            temperature,
            maxOutputTokens
        );
    }

    private String parseGeminiResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            if (root.has("candidates") && root.get("candidates").size() > 0) {
                JsonNode content = root.get("candidates").get(0).get("content");
                if (content != null && content.has("parts") && content.get("parts").size() > 0) {
                    return content.get("parts").get(0).get("text").asText();
                }
            }
            logger.warn("Unable to parse Gemini response: {}", responseBody);
            return getFallbackResponse();
        } catch (Exception e) {
            logger.error("Error parsing Gemini response", e);
            return getFallbackResponse();
        }
    }

    private String getFallbackResponse() {
        return "Başlık: Yüzüklerin Efendisi\n" +
               "Yazar: J.R.R. Tolkien\n" +
               "Tür: Fantastik Kurgu\n" +
               "Açıklama: Epik bir macera ve zengin bir hayal gücü arayanlar için mükemmel bir seçim.\n" +
               "Zorluk: Orta";
    }
} 