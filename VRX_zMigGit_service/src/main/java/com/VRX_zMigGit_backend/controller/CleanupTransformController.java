package com.VRX_zMigGit_backend.controller;

import java.io.File;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VRX_zMigGit_backend.service.CleanupTransformService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin
public class CleanupTransformController {
    @Value("${custom.base-path}")
    private String basePath;

    @Value("${custom.report-path}")
    private String reportPath;

    @Autowired
    CleanupTransformService cleanupTransformService;

    @GetMapping("/folder-structure")
    public String detectSubFolder() throws IOException {

        String folderPath = basePath + "\\Sys_TRAINING";

        File baseFolder = new File(folderPath);

        if (!baseFolder.exists()) {
            System.out.println("❌ Folder not found.");
            return "This Folder is Empty.";
        }

        Map<String, Object> structure = new LinkedHashMap<>();
        structure.put(baseFolder.getName(), cleanupTransformService.buildFolderTree(baseFolder));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(structure);

        return json;
    }

    @GetMapping("/cleanup")
    public ResponseEntity<String> delFolder() throws IOException{
        File folder = new File(basePath);
        boolean res = cleanupTransformService.deleteFolder(folder);
        if (res) {
            return ResponseEntity.ok("✅ Contents of the local folder deleted successfully.");
        } else {
            return ResponseEntity.ok("❌ Failed to delete some contents.");
        }

    }
}
