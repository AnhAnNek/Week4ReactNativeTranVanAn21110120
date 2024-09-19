package com.universityweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EasyEnglishBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(EasyEnglishBeApplication.class, args);
	}

}
