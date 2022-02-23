package com.tsolution.config;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SimpleCorsFilter implements Filter {

	private static final Logger logger = LogManager.getLogger(SimpleCorsFilter.class);

	public SimpleCorsFilter() {
		// Do nothing
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
		try {
			HttpServletResponse response = (HttpServletResponse) res;
			HttpServletRequest request = (HttpServletRequest) req;
			String originHeader = request.getHeader("Origin");
			response.setHeader("Access-Control-Allow-Origin", originHeader);
			response.setHeader("Access-Control-Allow-Credentials", "true");
			response.setHeader("Access-Control-Allow-Methods", "*");
			response.setHeader("Access-Control-Max-Age", "3600");
			response.setHeader("Access-Control-Allow-Headers",
					"Origin, X-Requested-With, Content-Type, Content-Disposition, Accept, Key, Authorization, Accept-Language, enctype, remember-me");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition, Set-Cookie");
			if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
				response.setStatus(HttpServletResponse.SC_OK);
			} else {
				chain.doFilter(req, res);
			}
		} catch (IOException | ServletException e) {
			SimpleCorsFilter.logger.error(e.getMessage(), e);
		}
	}

	@Override
	public void init(FilterConfig filterConfig) {
		// Do nothing
	}

	@Override
	public void destroy() {
		// Do nothing
	}
}
