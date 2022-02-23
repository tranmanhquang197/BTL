package com.tsolution.sso.config;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsolution.sso._1entities.User;
import com.tsolution.sso._1entities.dto.UserDto;
import com.tsolution.sso._1entities.enums.LoginStatus;
import com.tsolution.sso._2repository.CountActionLogRepository;
import com.tsolution.sso._2repository.LoginLogRepository;
import com.tsolution.sso._2repository.UserRepository;
import com.tsolution.sso.exceptions.BusinessException;

@Component
public class AuthenticationEventListener {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private LoginLogRepository loginLogRepository;

	@Autowired
	private HttpServletRequest request;

	@Autowired
	private HttpServletResponse response;

	@Autowired
	private CountActionLogRepository countActionLogRepository;

	private String getClientIP() {
		String xfHeader = this.request.getHeader("X-Forwarded-For");
		if (xfHeader == null) {
			return this.request.getRemoteAddr();
		}
		return xfHeader.split(",")[0];
	}

	@EventListener
	@Transactional(rollbackFor = RuntimeException.class)
	public void authenticationFailed(AuthenticationFailureBadCredentialsEvent event)
			throws BusinessException, IOException {
		String username = (String) event.getAuthentication().getPrincipal();
		AuthenticationException authenticationException = event.getException();
		if (authenticationException != null) {
			this.userRepository.addMoreAttemptLoginFailed(username);
			this.loginLogRepository.logLogin(username, this.getClientIP(), LoginStatus.FAILED);
			Optional<User> oUser = this.userRepository.findOneByUsername(username);
			if (oUser.isPresent()) {
				User user = oUser.get();
				if (Boolean.FALSE.equals(user.getEnabled())) {
					ObjectMapper objectMapper = new ObjectMapper();
					this.response.setStatus(HttpStatus.UNAUTHORIZED.value());
					this.response.setContentType("application/json");
					Map<String, Object> data = new HashMap<>();
					data.put("error", HttpStatus.UNAUTHORIZED.getReasonPhrase());
					data.put("error_description", "Locked");
					OutputStream out = this.response.getOutputStream();
					objectMapper.writeValue(out, data);
					out.flush();
				}
			}
		}
	}

	@EventListener
	@Transactional
	public void authenticationSuccess(AuthenticationSuccessEvent event) throws BusinessException {
		String remoteAddr = this.request.getRemoteAddr();
		if (!(event.getAuthentication().getPrincipal() instanceof UserDto)) {
			return;
		}
		UserDto userDto = (UserDto) event.getAuthentication().getPrincipal();
		if (event.getSource() instanceof UsernamePasswordAuthenticationToken) {
			if (!Boolean.TRUE.equals(userDto.getEnabled())) {
				return;
			}
			if (userDto.getAttemptLoginFailed() > 0) {
				this.userRepository.resetAttemptLoginFailed(userDto.getUsername());
			}
			this.loginLogRepository.logLogin(userDto.getUsername(), remoteAddr, LoginStatus.SUCCESS);
			this.countActionLogRepository.increaseTotalAction(userDto.getUsername());
		} else if (event.getSource() instanceof OAuth2Authentication) {
			this.countActionLogRepository.increaseTotalAction(userDto.getUsername());
		}
	}
}
