package com.tsolution;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserDetailsService userDetailsService;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
		successHandler.setTargetUrlParameter("redirectTo");
		successHandler.setDefaultTargetUrl("/");

		http.authorizeRequests().antMatchers("/assets/**").permitAll().antMatchers("/login").permitAll().anyRequest()
				.authenticated().and().formLogin().loginPage("/login").successHandler(successHandler).and().logout()
				.logoutUrl("/logout").and().httpBasic().and().csrf()
				.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
				.ignoringRequestMatchers(new AntPathRequestMatcher("/instances", HttpMethod.POST.toString()),
						new AntPathRequestMatcher("/instances/*", HttpMethod.DELETE.toString()),
						new AntPathRequestMatcher("/actuator/**"))
				.and().rememberMe().key(UUID.randomUUID().toString()).userDetailsService(this.userDetailsService)
				.tokenValiditySeconds(1209600);
	}
}
