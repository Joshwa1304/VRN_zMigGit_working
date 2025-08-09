package com.VRX_zMigGit_backend.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VRX_zMigGit_backend.service.ValidationReportService;

@RestController
@CrossOrigin
public class ValidationReportController {
    @Value("${custom.base-path}")
    private String basePath;

    @Value("${custom.report-path}")
    private String reportPath;

    @Autowired
    ValidationReportService validationReportService;

    @GetMapping("/validate")
    public String validateReport() {

        // System.out.println("Reports Create SuccessFully");
        return "✅ Reports Create SuccessFully.";
    }

    @GetMapping("/reports/filesize")
    public ResponseEntity<Resource> openReport() throws FileNotFoundException {

        boolean sizeRes = validationReportService.folderCreation();

        if (sizeRes) {
            validationReportService.fileSizeReport();
        }

        String filePath = reportPath + "\\File_Size_Report.html";

        File file = new File(filePath);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + file.getName())
                .contentType(MediaType.TEXT_HTML)
                .body(resource);
    }

    @GetMapping("/reports/filecount")
    public ResponseEntity<Resource> openCount() throws FileNotFoundException {

        boolean countRes = validationReportService.folderCreation();
        if (countRes) {
            validationReportService.fileCountReport();
        }

        String filePath = reportPath + "\\File_Count_Report.html";

        File file = new File(filePath);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + file.getName())
                .contentType(MediaType.TEXT_HTML)
                .body(resource);
    }
}
