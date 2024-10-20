package com.universityweb.course.service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class UploadFileService {
    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile multipartFile) throws IOException {
        String fileName = multipartFile.getOriginalFilename();
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        String resourceType;
        switch (extension) {
            case "mp4":
            case "mov":
            case "avi":
                resourceType = "video";
                break;
            case "mp3":
            case "wav":
            case "ogg":
                resourceType = "raw";
                break;
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                resourceType = "image";
                break;
            default:
                throw new IllegalArgumentException("Định dạng tệp không được hỗ trợ: " + extension);
        }

        return cloudinary.uploader()
                .upload(multipartFile.getBytes(),
                        Map.of(
                                "public_id", UUID.randomUUID().toString(),
                                "resource_type", resourceType
                        ))
                .get("url")
                .toString();
    }
}
