package com.tsolution.config;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuditorAwareImpl implements AuditorAware<String> {
	// Phục vụ việc auto lấy current user để apply vào các cột
	// created_user vs updated_user
	private Optional<String> getCurrentAuthoziedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (!(authentication instanceof AnonymousAuthenticationToken)) {
			return authentication == null ? Optional.empty() : Optional.of(authentication.getName());
		}
		return Optional.empty();
	}

	@Override
	public Optional<String> getCurrentAuditor() {
		return this.getCurrentAuthoziedUser();
	}
}
