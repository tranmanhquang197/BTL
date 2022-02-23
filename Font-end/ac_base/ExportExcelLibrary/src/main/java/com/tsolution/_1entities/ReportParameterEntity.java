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
@Table(name = "REPORT_PARAMETER")

public class ReportParameterEntity implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = -9142125707774013481L;

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

	@Column(name = "FORM_CODE", nullable = false)
	private String formCode;

	@Column(name = "PARAM_LIST", nullable = false)
	private String paramList;

	@Column(name = "FUNC_NAME")
	private String funcName;

	@Column(name = "RPT_TEMPLATE_PATH")
	private String rptTemplatePath;

	@Column(name = "IS_DYNAMIC")
	private String isDynamic;

	public String getParamList() {
		return this.paramList;
	}

	public void setParamList(String paramList) {
		this.paramList = paramList;
	}

	public String getFuncName() {
		return this.funcName;
	}

	public void setFuncName(String funcName) {
		this.funcName = funcName;
	}

	public String getRptTemplatePath() {
		return this.rptTemplatePath;
	}

	public void setRptTemplatePath(String rptTemplatePath) {
		this.rptTemplatePath = rptTemplatePath;
	}

	public String getIsDynamic() {
		return this.isDynamic;
	}

	public void setIsDynamic(String isDynamic) {
		this.isDynamic = isDynamic;
	}

	public String getFormCode() {
		return this.formCode;
	}

	public void setFormCode(String formCode) {
		this.formCode = formCode;
	}
}
