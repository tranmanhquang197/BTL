package com.tsolution._1entities;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "REPORT_CONSTRAINT")

public class ReportConstraintEntity implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 3596587731643402430L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", insertable = false, nullable = false)
	private Long id;

	@Column(name = "create_date")
	private LocalDateTime createDate;

	@Column(name = "create_user")
	private String createUser;

	@Column(name = "update_date")
	private LocalDateTime updateDate;

	@Column(name = "update_user")
	private String updateUser;

	@Column(name = "PARAM_ID")
	private String paramId;

	@Column(name = "MAX_PARAM_ID")
	private String maxParamId;

	@Column(name = "MAX_VALUE")
	private String maxValue;

	@Column(name = "PARAM_TYPE")
	private Integer paramType;

	@Column(name = "IS_REQUIRED")
	private Integer isRequired;

	@Column(name = "REPORT_CODE")
	private String reportCode;

	@Column(name = "DATA_SRC")
	private String dataSrc;

	@Column(name = "PARAM_NAME")
	private String paramName;

	@Column(name = "DEFAULT_VALUE")
	private String defaultValue;

	@Column(name = "MIN_VALUE")
	private String minValue;

	public String getParamId() {
		return this.paramId;
	}

	public void setParamId(String paramId) {
		this.paramId = paramId;
	}

	public String getMaxParamId() {
		return this.maxParamId;
	}

	public void setMaxParamId(String maxParamId) {
		this.maxParamId = maxParamId;
	}

	public String getMaxValue() {
		return this.maxValue;
	}

	public void setMaxValue(String maxValue) {
		this.maxValue = maxValue;
	}

	public Integer getParamType() {
		return this.paramType;
	}

	public void setParamType(Integer paramType) {
		this.paramType = paramType;
	}

	public Integer getIsRequired() {
		return this.isRequired;
	}

	public void setIsRequired(Integer isRequired) {
		this.isRequired = isRequired;
	}

	public String getReportCode() {
		return this.reportCode;
	}

	public void setReportCode(String reportCode) {
		this.reportCode = reportCode;
	}

	public String getDataSrc() {
		return this.dataSrc;
	}

	public void setDataSrc(String dataSrc) {
		this.dataSrc = dataSrc;
	}

	public String getParamName() {
		return this.paramName;
	}

	public void setParamName(String paramName) {
		this.paramName = paramName;
	}

	public String getDefaultValue() {
		return this.defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public String getMinValue() {
		return this.minValue;
	}

	public void setMinValue(String minValue) {
		this.minValue = minValue;
	}
}
