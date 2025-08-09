package com.VRX_zMigGit_backend.service;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CleanupTransformService {
    @Value("${custom.base-path}")
    String basePath;
    public Map<String, Object> buildFolderTree(File folder) {
        Map<String, Object> result = new LinkedHashMap<>();

        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    result.put(file.getName(), buildFolderTree(file));
                }
            }
        }

        return result;
    }

    public boolean deleteFolder(File folder) {
        if (!folder.exists()) {
            System.out.println("Folder does not exist.");
            return false;
        }

        // Delete all files and subfolders
        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    deleteFolder(file); // Recursive call
                } else {
                    file.delete();
                }
            }
        }

        // Finally delete the folder itself
        return folder.delete();
    }
}
