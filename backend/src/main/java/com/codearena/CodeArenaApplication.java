package com.codearena;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.TimeZone;

@SpringBootApplication
@EnableJpaRepositories
@EnableTransactionManagement
public class CodeArenaApplication {

    public static void main(String[] args) {
        // Enforce Asia/Kolkata timezone default for consistent date handling
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(CodeArenaApplication.class, args);
    }
}
