package com.tsolution.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

import com.tsolution.config.WebSecurityConfigurer.BasicRequestMatcher;

@Configuration
@EnableResourceServer
@Order(3)
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

	private static final Logger logger = LogManager.getLogger(ResourceServerConfig.class);

	@Override
	public void configure(HttpSecurity http) {
		try {
			http.anonymous().disable().requestMatcher(new BasicRequestMatcher()).authorizeRequests()
					.antMatchers(WebSecurityConfigurer.resources).permitAll().antMatchers("/**").authenticated().and()
					.httpBasic().disable();
		} catch (Exception e) {
			ResourceServerConfig.logger.error(e.getMessage(), e);
		}
	}

}
