package com.tsolution._1entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.tsolution._1entities.base.SuperEntityAuditing;
import com.voodoodyne.jackson.jsog.JSOGGenerator;

@Entity
@Table(name = "generator")
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Generator extends SuperEntityAuditing implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = -4829834668389367180L;

	@Id
	@Column(name = "code", nullable = false)
	private String code;

	@Column(name = "value", nullable = false)
	private String value;

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getValue() {
		return this.value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public Generator() {
	}

	public Generator(String code, String value) {
		this.code = code;
		this.value = value;
	}

}