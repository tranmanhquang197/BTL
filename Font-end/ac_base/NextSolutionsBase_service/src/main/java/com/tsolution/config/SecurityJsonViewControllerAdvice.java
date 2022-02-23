package com.tsolution.config;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.AbstractMappingJacksonResponseBodyAdvice;

import com.tsolution._1entities.base.SuperEntity;
import com.tsolution._1entities.enums.JsonEntityViewer;

@RestControllerAdvice
public class SecurityJsonViewControllerAdvice extends AbstractMappingJacksonResponseBodyAdvice {

	@Override
	protected void beforeBodyWriteInternal(MappingJacksonValue bodyContainer, MediaType contentType,
			MethodParameter returnType, ServerHttpRequest request, ServerHttpResponse response) {
		if ((SecurityContextHolder.getContext().getAuthentication() != null)
				&& (SecurityContextHolder.getContext().getAuthentication().getAuthorities() != null)) {
			Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication()
					.getAuthorities();
			if (authorities.parallelStream().anyMatch(x -> "GOD".equalsIgnoreCase(x.getAuthority()))) {
				bodyContainer.setSerializationView(JsonEntityViewer.GOD.class);
			} else {
				Object value = bodyContainer.getValue();
				bodyContainer.setSerializationView(this.findClass(value, request));
			}
		}
	}

	private Class<?> findClass(Object value, ServerHttpRequest request) {
		String path = request.getURI().getPath();
		Optional<String> oKey = JsonEntityViewer.MapRequest.keySet().parallelStream()
				.filter(key -> key.startsWith("^") && Pattern.matches(key, path)).findFirst();
		if (!oKey.isPresent()) {
			if ((value instanceof Page) || (value instanceof List)) {
				Class<?> itf = JsonEntityViewer.MapRequest.get(request.getURI().getPath());
				return itf == null ? JsonEntityViewer.Human.Summary.class : itf;
			} else if (value instanceof SuperEntity) {
				SuperEntity superEntity = (SuperEntity) value;
				Class<?> itf = JsonEntityViewer.MapRequest
						.get(request.getURI().getPath().replace(superEntity.getId().toString(), "{id}"));
				return itf == null ? JsonEntityViewer.Human.Detail.class : itf;
			} else {
				return JsonEntityViewer.Human.Summary.class;
			}
		}
		return JsonEntityViewer.MapRequest.get(oKey.get());
	}
}