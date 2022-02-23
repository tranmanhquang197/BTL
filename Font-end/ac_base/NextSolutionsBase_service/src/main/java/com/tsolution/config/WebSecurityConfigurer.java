package com.tsolution.config;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@EnableOAuth2Sso
public class WebSecurityConfigurer extends WebSecurityConfigurerAdapter {

	private static final Logger logger = LogManager.getLogger(WebSecurityConfigurer.class);
	protected static final String[] resources = new String[] { "/oauth/**", "/languages**", "/swagger**/**",
			"/webjars/**", "/v2/api-docs", "/api/document" };

	@Override
	public void configure(WebSecurity web) {
		try {
			web.ignoring().antMatchers(WebSecurityConfigurer.resources);
		} catch (Exception e) {
			WebSecurityConfigurer.logger.error(e.getMessage(), e);
		}
	}

	@Override
	public void configure(HttpSecurity http) {
		try {
			http.anonymous().disable().requestMatcher(new BasicRequestMatcher()).authorizeRequests()
					.antMatchers(WebSecurityConfigurer.resources).permitAll().antMatchers("/**").authenticated().and()//
					.httpBasic().disable().cors().and().csrf().disable()//
					.headers().frameOptions().disable().and()//
					.formLogin().permitAll();
		} catch (Exception e) {
			WebSecurityConfigurer.logger.error(e.getMessage(), e);
		}
	}

	protected static class BasicRequestMatcher implements RequestMatcher {
		@Override
		public boolean matches(HttpServletRequest request) {
			String auth = request.getHeader("Authorization");
			return ((auth != null) && auth.toUpperCase().startsWith("BEARER"));
		}
	}
}
