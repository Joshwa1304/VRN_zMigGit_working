package com.VRN_zMigGit_backend.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.VRN_zMigGit_backend.service.JsonMongoService;
import com.VRN_zMigGit_backend.service.TransformGitService;

@RestController
@CrossOrigin
public class TransformGitController {
    @Autowired
    JsonMongoService jsonMongoService;

    @Autowired
    TransformGitService transformGitService;

    @Value("${custom.base-path}")
    private String basePath;

    @PostMapping("/extract")
    public String extactEnv(@RequestParam("file") MultipartFile file) {

        try {

            InputStream input = file.getInputStream();
            String msg = jsonMongoService.insJsonMongo(input);
            return msg;
        }

        catch (Exception e) {
            e.printStackTrace();
            return "MongoDB Error.";
        }
    }

    @GetMapping("/mapping")
    public Map<String, String> mappingData() throws IOException {
        LinkedHashMap<String, String> mapping = transformGitService.mappingData();

        return mapping;
    }

    @PostMapping("/transform")
    public ResponseEntity<String> transformPlatform(@RequestBody Map<String, String> data) {
        String source = data.get("sourcePlatform");
        String platform = data.get("platform");
        String type = data.get("type");

        System.out.println("Received platform: " + platform + ", type: " + type);

        StringBuilder msg = new StringBuilder();

        if (source.equalsIgnoreCase("endevor")) {
            boolean transformRes = transformGitService.transform();
            if (transformRes) {
                msg.append("✅ Transformation completed and files were saved locally.\n");
            }

            else {
                msg.append("❌ Invalid source platform provided.\n");
            }
        } else {
            msg.append("⚠️ Please select a target platform");
        }

        if ("target".equalsIgnoreCase(type)) {
            boolean gitPushRes = transformGitService.gitPush(platform);

            if (gitPushRes) {
                msg.append("✅ Changes pushed to Git repository.");
            } else {
                msg.append("❌ Failed to push changes to Git.");
            }

        } else {
            msg.append("⚠️ Please select a source platform");
        }

        return ResponseEntity.ok(msg.toString());
    }
}
