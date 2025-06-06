package aybu.graduationproject.okuyorum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@EnableRetry
public class OkuYorumApplication {

	public static void main(String[] args) {
		SpringApplication.run(OkuYorumApplication.class, args);
	}

}
