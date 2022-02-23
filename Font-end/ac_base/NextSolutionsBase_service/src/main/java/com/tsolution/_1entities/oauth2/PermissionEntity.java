package com.tsolution._1entities.oauth2;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Table(name = "app_permission")
@Entity
public class PermissionEntity implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = -575415150358637616L;

	@Id
	@Column(name = "id", insertable = false, nullable = false)
	private Long id;

	@Column(name = "client_id")
	private String clientId;

	@Column(name = "url", nullable = false)
	private String url;

	@Column(name = "description")
	private String description = "NULL";

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

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}