package com.tsolution;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.tsolution.*")
public class ExportExcelLibraryApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExportExcelLibraryApplication.class, args);
	}

}
