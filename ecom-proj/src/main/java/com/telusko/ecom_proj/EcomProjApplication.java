package com.telusko.ecom_proj;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class EcomProjApplication {

	public static void main(String[] args) {

		SpringApplication.run(EcomProjApplication.class, args);
	}
	@Bean // 👈 Add this bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}


}