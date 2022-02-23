package com.tsolution._3services.impl;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import javax.activation.MimetypesFileTypeMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tsolution.config.FileStorageProperties;
import com.tsolution.excetions.BusinessException;

@Service
public class FileStorageService extends BaseService {
	private static final Logger log = LogManager.getLogger(FileStorageService.class);
	private final Path fileStorageLocation;
	private final String tempExportExcel;
	private final String libreOfficePath;

	@Autowired
	public FileStorageService(FileStorageProperties fileStorageProperties) throws BusinessException {
		this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize();
		this.tempExportExcel = fileStorageProperties.getTempExportExcel();
		this.libreOfficePath = fileStorageProperties.getLibreOfficePath();
		try {
			Files.createDirectories(this.fileStorageLocation);
		} catch (Exception ex) {
			throw new BusinessException(
					"Could not create the directory where the uploaded files will be stored.\n" + ex.getMessage());
		}
	}

	public String getTempExportExcel() {
		return this.tempExportExcel;
	}

	public String getLibreOfficePath() {
		return this.libreOfficePath;
	}

	public Resource loadFileAsResource(String fileName) throws BusinessException {
		try {
			Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());
			if (resource.exists()) {
				return resource;
			} else {
				throw new BusinessException("File not found " + fileName);
			}
		} catch (MalformedURLException ex) {
			throw new BusinessException("File not found " + fileName + "\n" + ex.getMessage());
		}
	}

	public HttpHeaders loadHttpHeaders(Resource resource) throws IOException {
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_TYPE, new MimetypesFileTypeMap().getContentType(resource.getFile()));
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");
		return headers;
	}

	public String saveFile(String relativePath, MultipartFile multipartFile) throws BusinessException {
		Path folderPath = Paths.get(this.fileStorageLocation.normalize().toString(), relativePath).normalize();
		String fileName = multipartFile.getOriginalFilename();
		Path filePath = folderPath.resolve(fileName);
		if (!folderPath.toFile().exists()) {
			try {
				FileUtils.forceMkdirParent(filePath.toFile());
			} catch (IOException e) {
				FileStorageService.log.error(e.getMessage(), e);
				throw new BusinessException(this.translator.toLocale("folder.can.not.create"));
			}
		}
		while (filePath.toFile().exists()) {
			String prefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
			filePath = folderPath.resolve(prefix + "_" + fileName);
		}
		try {
			multipartFile.transferTo(filePath);
		} catch (IllegalStateException | IOException e) {
			FileStorageService.log.error(e.getMessage(), e);
			throw new BusinessException(this.translator.toLocale("file.can.not.create"));
		}
		return this.fileStorageLocation.normalize().relativize(filePath).normalize().toString().replace("\\", "/");
	}

	public Boolean deleteFile(List<String> relativeFilePaths) {
		List<File> files = new ArrayList<>();
		for (String relativeFilePath : relativeFilePaths) {
			Path filePath = Paths.get(this.fileStorageLocation.normalize().toString(), relativeFilePath).normalize();
			if (!filePath.toFile().exists()) {
				return false;
			}
			files.add(filePath.toFile());
		}
		for (File file : files) {
			try {
				FileUtils.forceDelete(file);
			} catch (IOException e) {
				FileStorageService.log.error(e.getMessage(), e);
				return false;
			}
		}
		return true;
	}

	public String getAbsolutePath(String relativePath) {
		return Paths.get(this.fileStorageLocation.normalize().toString(), relativePath).normalize().toFile()
				.getAbsolutePath();
	}
}
