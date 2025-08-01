package com.VRN_zMigGit_backend.service;

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

    public boolean delSubFolder() {
        File folder = new File(basePath);
        boolean res = false;
        if (folder.exists() && folder.isDirectory()) {
            boolean result = deleteContents(folder);
            if (result) {
                res = true;
                System.out.println("Contents of the folder deleted successfully.");
            } else {
                res = false;
                System.out.println("Failed to delete some contents.");
            }
        } else {
            System.out.println("Folder does not exist.");
        }

        return res;
    }

    private static boolean deleteContents(File dir) {
        boolean allDeleted = true;

        File[] files = dir.listFiles();
        if (files != null) {
            for (File file : files) {
                boolean success;
                if (file.isDirectory()) {
                    success = deleteDirectory(file);
                } else {
                    success = file.delete();
                }

                if (!success) {
                    allDeleted = false;
                    System.out.println("Failed to delete: " + file.getAbsolutePath());
                }
            }
        }
        return allDeleted;
    }

    private static boolean deleteDirectory(File dir) {
        File[] children = dir.listFiles();
        if (children != null) {
            for (File child : children) {
                if (!deleteDirectory(child)) {
                    return false;
                }
            }
        }
        return dir.delete();
    }
}
