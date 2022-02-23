package com.tsolution._4controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import com.tsolution._3services.impl.FileStorageService;
import com.tsolution.excetions.BusinessException;

@RestController
@RequestMapping("/files")
public class FileController {
	@Autowired
	private FileStorageService fileStorageService;

	@GetMapping("/get-urls")
	public ResponseEntity<Object> getUrls() {
		List<String> urls = new ArrayList<>();
		urls.add("/files/T7_2019.png");
		return new ResponseEntity<>(urls, HttpStatus.OK);
	}

	@GetMapping("/**")
	@PreAuthorize("hasAuthority('**/**')")
	public ResponseEntity<Object> get(HttpServletRequest request) throws BusinessException, IOException {
		return this.fetchInfo(request);
	}

	@PostMapping("/**")
	@PreAuthorize("hasAuthority('**/**')")
	public ResponseEntity<Object> post(HttpServletRequest request) throws BusinessException, IOException {
		return this.fetchInfo(request);
	}

	private ResponseEntity<Object> fetchInfo(HttpServletRequest request) throws BusinessException, IOException {
		String relativeUrl = this.extractRelativeUrl(request);
		Resource resource = this.fileStorageService.loadFileAsResource(relativeUrl);
		HttpHeaders httpHeaders = this.fileStorageService.loadHttpHeaders(resource);
		return new ResponseEntity<>(resource, httpHeaders, HttpStatus.OK);
	}

	private String extractRelativeUrl(HttpServletRequest request) {
		String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE); // /files/relativeUrl
		String bestMatchPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE); // /files/**
		return new AntPathMatcher().extractPathWithinPattern(bestMatchPattern, path); // relativeUrl
	}
}
