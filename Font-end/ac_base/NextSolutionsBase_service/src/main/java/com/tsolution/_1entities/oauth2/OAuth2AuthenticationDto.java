package com.tsolution._1entities.oauth2;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@SuppressWarnings("all")
@JsonIgnoreProperties(ignoreUnknown = true)
public class OAuth2AuthenticationDto implements Serializable {
	/**
	 *
	 */
	private static final long serialVersionUID = 1139407257255426108L;
	private List<Authorities> authorities = new ArrayList<>();
	Details details;
	private boolean authenticated;
	UserAuthentication userAuthentication;
	private boolean clientOnly;
	private String credentials;
	Oauth2Request oauth2Request;
	Principal principal;
	private String name;

	public List<Authorities> getAuthorities() {
		return this.authorities;
	}

	public void setAuthorities(List<Authorities> authorities) {
		this.authorities = authorities;
	}

	public Details getDetails() {
		return this.details;
	}

	public boolean getAuthenticated() {
		return this.authenticated;
	}

	public UserAuthentication getUserAuthentication() {
		return this.userAuthentication;
	}

	public boolean getClientOnly() {
		return this.clientOnly;
	}

	public String getCredentials() {
		return this.credentials;
	}

	public Oauth2Request getOauth2Request() {
		return this.oauth2Request;
	}

	public Principal getPrincipal() {
		return this.principal;
	}

	public String getName() {
		return this.name;
	}

	public void setDetails(Details detailsObject) {
		this.details = detailsObject;
	}

	public void setAuthenticated(boolean authenticated) {
		this.authenticated = authenticated;
	}

	public void setUserAuthentication(UserAuthentication userAuthenticationObject) {
		this.userAuthentication = userAuthenticationObject;
	}

	public void setClientOnly(boolean clientOnly) {
		this.clientOnly = clientOnly;
	}

	public void setCredentials(String credentials) {
		this.credentials = credentials;
	}

	public void setOauth2Request(Oauth2Request oauth2RequestObject) {
		this.oauth2Request = oauth2RequestObject;
	}

	public void setPrincipal(Principal principalObject) {
		this.principal = principalObject;
	}

	public void setName(String name) {
		this.name = name;
	}

	public static class Authorities implements Serializable {
		/**
		*
		*/
		private static final long serialVersionUID = -1791956562695032758L;
		private String authority;

		public String getAuthority() {
			return this.authority;
		}

		public void setAuthority(String authority) {
			this.authority = authority;
		}

	}

	public static class Principal implements Serializable {
		/**
		 *
		 */
		private static final long serialVersionUID = 3289291300427343018L;
		private String password = null;
		private String username;
		private List<Authorities> authorities = new ArrayList<>();
		private boolean accountNonExpired;
		private boolean accountNonLocked;
		private boolean credentialsNonExpired;
		private boolean enabled;
		private String firstName;
		private String lastName;
		private List<RoleDto> roles = new ArrayList<>();
		private Integer loginSuccessToday;
		private boolean mustChangePassword;
		private Integer attemptLoginFailed;

		public List<Authorities> getAuthorities() {
			return this.authorities;
		}

		public void setAuthorities(List<Authorities> authorities) {
			this.authorities = authorities;
		}

		public List<RoleDto> getRoles() {
			return this.roles;
		}

		public void setRoles(List<RoleDto> roles) {
			this.roles = roles;
		}

		public String getPassword() {
			return this.password;
		}

		public String getUsername() {
			return this.username;
		}

		public boolean getAccountNonExpired() {
			return this.accountNonExpired;
		}

		public boolean getAccountNonLocked() {
			return this.accountNonLocked;
		}

		public boolean getCredentialsNonExpired() {
			return this.credentialsNonExpired;
		}

		public boolean getEnabled() {
			return this.enabled;
		}

		public String getFirstName() {
			return this.firstName;
		}

		public String getLastName() {
			return this.lastName;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public void setAccountNonExpired(boolean accountNonExpired) {
			this.accountNonExpired = accountNonExpired;
		}

		public void setAccountNonLocked(boolean accountNonLocked) {
			this.accountNonLocked = accountNonLocked;
		}

		public void setCredentialsNonExpired(boolean credentialsNonExpired) {
			this.credentialsNonExpired = credentialsNonExpired;
		}

		public void setEnabled(boolean enabled) {
			this.enabled = enabled;
		}

		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}

		public void setLastName(String lastName) {
			this.lastName = lastName;
		}

		public Integer getLoginSuccessToday() {
			return this.loginSuccessToday;
		}

		public void setLoginSuccessToday(Integer loginSuccessToday) {
			this.loginSuccessToday = loginSuccessToday;
		}

		public boolean isMustChangePassword() {
			return this.mustChangePassword;
		}

		public void setMustChangePassword(boolean mustChangePassword) {
			this.mustChangePassword = mustChangePassword;
		}

		public Integer getAttemptLoginFailed() {
			return this.attemptLoginFailed;
		}

		public void setAttemptLoginFailed(Integer attemptLoginFailed) {
			this.attemptLoginFailed = attemptLoginFailed;
		}

	}

	public static class Oauth2Request implements Serializable {
		/**
		 *
		 */
		private static final long serialVersionUID = -3247543370173385239L;
		private String clientId;
		private List<String> scope = new ArrayList<>();
		private RequestParameters RequestParametersObject;
		private List<Object> resourceIds = new ArrayList<>();
		private List<Authorities> authorities = new ArrayList<>();
		private boolean approved;
		private boolean refresh;
		private String redirectUri = null;
		private List<Object> responseTypes = new ArrayList<>();
		private Extensions ExtensionsObject;
		private String grantType;
		private RefreshTokenRequest refreshTokenRequest;

		public List<String> getScope() {
			return this.scope;
		}

		public void setScope(List<String> scope) {
			this.scope = scope;
		}

		public List<Authorities> getAuthorities() {
			return this.authorities;
		}

		public void setAuthorities(List<Authorities> authorities) {
			this.authorities = authorities;
		}

		public RequestParameters getRequestParametersObject() {
			return this.RequestParametersObject;
		}

		public void setRequestParametersObject(RequestParameters requestParametersObject) {
			this.RequestParametersObject = requestParametersObject;
		}

		public List<Object> getResourceIds() {
			return this.resourceIds;
		}

		public void setResourceIds(List<Object> resourceIds) {
			this.resourceIds = resourceIds;
		}

		public List<Object> getResponseTypes() {
			return this.responseTypes;
		}

		public void setResponseTypes(List<Object> responseTypes) {
			this.responseTypes = responseTypes;
		}

		public Extensions getExtensionsObject() {
			return this.ExtensionsObject;
		}

		public void setExtensionsObject(Extensions extensionsObject) {
			this.ExtensionsObject = extensionsObject;
		}

		public String getClientId() {
			return this.clientId;
		}

		public RequestParameters getRequestParameters() {
			return this.RequestParametersObject;
		}

		public boolean getApproved() {
			return this.approved;
		}

		public boolean getRefresh() {
			return this.refresh;
		}

		public String getRedirectUri() {
			return this.redirectUri;
		}

		public Extensions getExtensions() {
			return this.ExtensionsObject;
		}

		public String getGrantType() {
			return this.grantType;
		}

		public RefreshTokenRequest getRefreshTokenRequest() {
			return this.refreshTokenRequest;
		}

		public void setClientId(String clientId) {
			this.clientId = clientId;
		}

		public void setRequestParameters(RequestParameters requestParametersObject) {
			this.RequestParametersObject = requestParametersObject;
		}

		public void setApproved(boolean approved) {
			this.approved = approved;
		}

		public void setRefresh(boolean refresh) {
			this.refresh = refresh;
		}

		public void setRedirectUri(String redirectUri) {
			this.redirectUri = redirectUri;
		}

		public void setExtensions(Extensions extensionsObject) {
			this.ExtensionsObject = extensionsObject;
		}

		public void setGrantType(String grantType) {
			this.grantType = grantType;
		}

		public void setRefreshTokenRequest(RefreshTokenRequest refreshTokenRequest) {
			this.refreshTokenRequest = refreshTokenRequest;
		}
	}

	public static class Extensions implements Serializable {

		/**
		 *
		 */
		private static final long serialVersionUID = 4549690539211142557L;
	}

	public static class RefreshTokenRequest implements Serializable {

		private static final long serialVersionUID = 1710690539211142557L;

		private String clientId;
		private List<String> scope;
		private RequestParameters requestParameters;
		private String grantType;

		public String getClientId() {
			return this.clientId;
		}

		public void setClientId(String clientId) {
			this.clientId = clientId;
		}

		public List<String> getScope() {
			return this.scope;
		}

		public void setScope(List<String> scope) {
			this.scope = scope;
		}

		public RequestParameters getRequestParameters() {
			return this.requestParameters;
		}

		public void setRequestParameters(RequestParameters requestParameters) {
			this.requestParameters = requestParameters;
		}

		public String getGrantType() {
			return this.grantType;
		}

		public void setGrantType(String grantType) {
			this.grantType = grantType;
		}

	}

	// Vì json nó trả về dạng _ nên phải để nguyên biến -> bỏ qua mã sonar này
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class RequestParameters implements Serializable {
		/**
		 *
		 */
		private static final long serialVersionUID = -8379934513117437623L;
		private String grant_type;
		private String client_id;
		private String username;
		private String refresh_token;

		public String getGrant_type() {
			return this.grant_type;
		}

		public String getClient_id() {
			return this.client_id;
		}

		public String getUsername() {
			return this.username;
		}

		public String getRefresh_token() {
			return this.refresh_token;
		}

		public void setGrant_type(String grant_type) {
			this.grant_type = grant_type;
		}

		public void setClient_id(String client_id) {
			this.client_id = client_id;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public void setRefresh_token(String refresh_token) {
			this.refresh_token = refresh_token;
		}
	}

	public static class UserAuthentication implements Serializable {
		/**
		 *
		 */
		private static final long serialVersionUID = -8729822077881463990L;
		private List<Authorities> authorities = new ArrayList<>();
		private Details details;
		private boolean authenticated;
		private Principal principal;
		private String credentials = null;
		private String name;

		public List<Authorities> getAuthorities() {
			return this.authorities;
		}

		public void setAuthorities(List<Authorities> authorities) {
			this.authorities = authorities;
		}

		public Details getDetails() {
			return this.details;
		}

		public boolean getAuthenticated() {
			return this.authenticated;
		}

		public Principal getPrincipal() {
			return this.principal;
		}

		public String getCredentials() {
			return this.credentials;
		}

		public String getName() {
			return this.name;
		}

		public void setDetails(Details detailsObject) {
			this.details = detailsObject;
		}

		public void setAuthenticated(boolean authenticated) {
			this.authenticated = authenticated;
		}

		public void setPrincipal(Principal principalObject) {
			this.principal = principalObject;
		}

		public void setCredentials(String credentials) {
			this.credentials = credentials;
		}

		public void setName(String name) {
			this.name = name;
		}

		// Vì json nó trả về dạng _ nên phải để nguyên biến -> bỏ qua mã sonar này
		@JsonIgnoreProperties(ignoreUnknown = true)
		public class Details implements Serializable {
			/**
			 *
			 */
			private static final long serialVersionUID = -5031584754651230685L;
			private String client_secret;
			private String scope;
			private String grant_type;
			private String client_id;
			private String username;

			public String getClient_secret() {
				return this.client_secret;
			}

			public String getScope() {
				return this.scope;
			}

			public String getGrant_type() {
				return this.grant_type;
			}

			public String getClient_id() {
				return this.client_id;
			}

			public String getUsername() {
				return this.username;
			}

			public void setClient_secret(String client_secret) {
				this.client_secret = client_secret;
			}

			public void setScope(String scope) {
				this.scope = scope;
			}

			public void setGrant_type(String grant_type) {
				this.grant_type = grant_type;
			}

			public void setClient_id(String client_id) {
				this.client_id = client_id;
			}

			public void setUsername(String username) {
				this.username = username;
			}
		}
	}

	public static class Details implements Serializable {
		/**
		 *
		 */
		private static final long serialVersionUID = -2977483594772292124L;
		private String remoteAddress;
		private String sessionId = null;
		private String tokenValue;
		private String tokenType;
		private String decodedDetails = null;

		public String getRemoteAddress() {
			return this.remoteAddress;
		}

		public String getSessionId() {
			return this.sessionId;
		}

		public String getTokenValue() {
			return this.tokenValue;
		}

		public String getTokenType() {
			return this.tokenType;
		}

		public String getDecodedDetails() {
			return this.decodedDetails;
		}

		public void setRemoteAddress(String remoteAddress) {
			this.remoteAddress = remoteAddress;
		}

		public void setSessionId(String sessionId) {
			this.sessionId = sessionId;
		}

		public void setTokenValue(String tokenValue) {
			this.tokenValue = tokenValue;
		}

		public void setTokenType(String tokenType) {
			this.tokenType = tokenType;
		}

		public void setDecodedDetails(String decodedDetails) {
			this.decodedDetails = decodedDetails;
		}
	}
}
