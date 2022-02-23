package com.tsolution.config;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import com.google.common.collect.Lists;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.Contact;
import springfox.documentation.service.GrantType;
import springfox.documentation.service.OAuth;
import springfox.documentation.service.ResourceOwnerPasswordCredentialsGrant;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

	@Value("${security.oauth2.client.accessTokenUri}")
	private String authUrl;

	@Value("${security.oauth2.client.clientId}")
	private String clientId;

	@Bean
	public Docket api() {
//        List<ResponseMessage> list = new java.util.ArrayList<>()
//        list.add(new ResponseMessageBuilder().code(500).message("500 message")
//                .responseModel(new ModelRef("Result")).build())
//        list.add(new ResponseMessageBuilder().code(401).message("Unauthorized")
//                .responseModel(new ModelRef("Result")).build())
//        list.add(new ResponseMessageBuilder().code(406).message("Not Acceptable")
//                .responseModel(new ModelRef("Result")).build())

		return new Docket(DocumentationType.SWAGGER_2).select()
				.apis(RequestHandlerSelectors.withClassAnnotation(RestController.class)).paths(PathSelectors.any())
				.build().apiInfo(this.getApiInfo()).securitySchemes(Collections.singletonList(this.securitySchema()))
				.securityContexts(Collections.singletonList(this.securityContext())).pathMapping("/")
				.useDefaultResponseMessages(false);

	}

	private OAuth securitySchema() {
//        List<AuthorizationScope> authorizationScopeList = newArrayList()
//        authorizationScopeList.add(new AuthorizationScope("read", "read all"))
//        authorizationScopeList.add(new AuthorizationScope("write", "access all"))

		List<GrantType> grantTypes = Lists.newArrayList();
		GrantType creGrant = new ResourceOwnerPasswordCredentialsGrant(this.authUrl);
		grantTypes.add(creGrant);
		return new OAuth("oauth2schema", Lists.newArrayList(), grantTypes);
	}

	private SecurityContext securityContext() {
		return SecurityContext.builder().securityReferences(this.defaultAuth()).forPaths(PathSelectors.ant("/**"))
				.build();
	}

	private List<SecurityReference> defaultAuth() {
		return Collections.singletonList(new SecurityReference("oauth2schema", new AuthorizationScope[0]));
	}

	private ApiInfo getApiInfo() {
		return new ApiInfoBuilder().title(this.clientId).description("Đây là cái mô tả nhé ^^").version("1.0.0")
				.license("LICENSE").licenseUrl("http://abc.xyz.com")
				.contact(new Contact(this.clientId, this.clientId + " Admin", "abc@xyz.xxx")).build();
	}

	protected void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
	}

}
