package com.VRN_zMigGit_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VRN_ZMigGitServiceApplication {

	public static void main(String[] args) {
		System.setProperty("java.awt.headless", "false");
		SpringApplication.run(VRN_ZMigGitServiceApplication.class, args);
	}

}
