package com.tsolution._1entities.oauth2;

import java.io.Serializable;
import java.util.List;

public class RoleDto implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 6582569587406895080L;

	private Long id;

	private String clientId;

	private String roleName;

	private String description;

	private List<PermissionEntity> permissions;

	private List<MenuEntity> menus;

	public RoleDto() {
	}

	public RoleDto(Long id) {
		this.id = id;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getClientId() {
		return this.clientId;
	}

	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	public String getRoleName() {
		return this.roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<PermissionEntity> getPermissions() {
		return this.permissions;
	}

	public List<MenuEntity> getMenus() {
		return this.menus;
	}

}
