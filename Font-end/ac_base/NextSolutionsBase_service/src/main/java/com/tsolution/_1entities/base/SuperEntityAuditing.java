package com.tsolution._1entities.base;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.tsolution._1entities.enums.JsonEntityViewer;
import com.tsolution.utils.Constants;
import com.tsolution.utils.DeserializeDateHandler;
import com.tsolution.utils.SerializeDateHandler;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class SuperEntityAuditing {

	@CreatedDate
	@Column(name = "create_date", nullable = false, updatable = false, insertable = true)
	@JsonFormat(pattern = Constants.DATE_PATTERN, shape = JsonFormat.Shape.STRING)
	@JsonSerialize(using = SerializeDateHandler.class)
	@JsonDeserialize(using = DeserializeDateHandler.class)
	@JsonView({ JsonEntityViewer.GOD.class, JsonEntityViewer.Custom.class, JsonEntityViewer.CustomDetail.class })
	private LocalDateTime createDate;

	@CreatedBy
	@Column(name = "create_user", nullable = false, updatable = false, insertable = true)
	@JsonView({ JsonEntityViewer.GOD.class, JsonEntityViewer.Custom.class, JsonEntityViewer.CustomDetail.class })
	private String createUser;

	@LastModifiedDate
	@Column(name = "update_date")
	@JsonFormat(pattern = Constants.DATE_PATTERN, shape = JsonFormat.Shape.STRING)
	@JsonSerialize(using = SerializeDateHandler.class)
	@JsonDeserialize(using = DeserializeDateHandler.class)
	@JsonView(JsonEntityViewer.GOD.class)
	private LocalDateTime updateDate;

	@LastModifiedBy
	@Column(name = "update_user")
	@JsonView(JsonEntityViewer.GOD.class)
	private String updateUser;

	public LocalDateTime getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(LocalDateTime createDate) {
		this.createDate = createDate;
	}

	public String getCreateUser() {
		return this.createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public LocalDateTime getUpdateDate() {
		return this.updateDate;
	}

	public void setUpdateDate(LocalDateTime updateDate) {
		this.updateDate = updateDate;
	}

	public String getUpdateUser() {
		return this.updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}
}
