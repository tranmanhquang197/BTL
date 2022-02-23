/**
 * Copyright 2015 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

/***
 * @author vuongmq
 * @date 18/08/2015
 * @description Lay danh sach ghe tham cua Staff voi Customer o Action_Log
 */
package com.tsolution._1entities.vo;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.tsolution._1entities.ReportParameterEntity;
import com.tsolution._3services.report.coreRpt.ParamConstraint;

public class ReportParameterVO implements Serializable {
	private static final long serialVersionUID = 1L;
	public static final String FIX_HEADER = "0";
	public static final String DYNAMIC_HEADER = "1";
	public static final String DYNAMIC_AND_PARAM_HEADER = "2";
	// parameter from db
	private boolean isUseDb;
	private String formCode; //
	private String paramList;
	private String funcName;
	private String rptTemplatePath;
	private String isDynamic;
	private String outFileName;

	// add more parameter
	private String realOutFile;
	private String realTemplPath;

	private List<Object> params;
	private Map<String, Object> beans;
	private String language;
	private int maxGroupLevel;
	private int fromRow;
	private int numCols;
	private long roleId;
	private long staffId;
	private HashMap<String, Object> extraParams;
	private List<ParamConstraint> constraints;
	private short rowHeight;

	public void setParameter(ReportParameterEntity entity) {
		this.formCode = entity.getFormCode();
		this.paramList = entity.getParamList();
		this.funcName = entity.getFuncName();
		this.rptTemplatePath = entity.getRptTemplatePath();
		this.isDynamic = entity.getIsDynamic();
	}

	public void init() {
		this.extraParams = new HashMap<>();
	}

	public String getSQLReport() {
		String rptSQL = "call " + this.funcName + "(?,?";

		if (ReportParameterVO.DYNAMIC_AND_PARAM_HEADER.equals(this.isDynamic)) {
			rptSQL += ",?,?";
		} else if (ReportParameterVO.DYNAMIC_HEADER.equals(this.isDynamic)) {
			rptSQL += ",?";
		}
		rptSQL += ",:lang, :roleId,:staffId";
		for (int i = 0; i < this.constraints.size(); i++) {
			rptSQL += ",:" + this.constraints.get(i).getParamId();// + paramNames.get(i);
		}
		rptSQL += ")";
		System.out.println("sqlreport:" + rptSQL);
		return rptSQL;

	}

	public String getFormCode() {
		return this.formCode;
	}

	public void setFormCode(String formCode) {
		this.formCode = formCode;
	}

	public String getParamList() {
		if (this.paramList == null) {
			return "";
		}
		return this.paramList;
	}

	public void setParamList(String paramList) {
		this.paramList = paramList;
	}

	public String[] paramToList() {
		if (this.paramList == null) {
			return new String[] {};
		}
		String[] lst = this.paramList.split(";");
		return lst;
	}

	public String getFuncName() {
		return this.funcName;
	}

	public void setFuncName(String funcName) {
		System.out.println("func:" + funcName);
		this.funcName = funcName;
	}

	public String getRealTemplFile() throws IOException {
//		return (new ClassPathResource(this.getRptTemplatePath() + this.formCode + ".xlsx").getFile()).getAbsolutePath();
		return this.getRptTemplatePath() + this.formCode + ".xlsx";
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

	public String getRealOutFile() {
		return this.realOutFile;
	}

	public void setRealOutFile(String realOutFile) {
		this.realOutFile = realOutFile;
	}

	public List<Object> getParams() {
		return this.params;
	}

	public void setParams(List<Object> params) {
		this.params = params;
	}

	public Map<String, Object> getBeans() {

		return this.beans == null ? new HashMap<>() : this.beans;
	}

	public void setBeans(Map<String, Object> beans) {
		this.beans = beans;
	}

	public String getLanguage() {
		return this.language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getRealTemplPath() {
		return this.realTemplPath;
	}

	public void setRealTemplPath(String realTemplPath) {
		this.realTemplPath = realTemplPath;
	}

	public int getMaxGroupLevel() {
		return this.maxGroupLevel;
	}

	public void setMaxGroupLevel(int maxGroupLevel) {
		this.maxGroupLevel = maxGroupLevel;
	}

	public int getFromRow() {
		return this.fromRow;
	}

	public void setFromRow(int fromRow) {
		this.fromRow = fromRow;
	}

	public boolean isUseDb() {
		return this.isUseDb;
	}

	public void setUseDb(boolean isUseDb) {
		this.isUseDb = isUseDb;
	}

	public HashMap<String, Object> getExtraParams() {
		return this.extraParams;
	}

	public void setExtraParams(HashMap<String, Object> extraParams) {
		this.extraParams = extraParams;
	}

	public void addExtraParam(String key, Object value) {
		if (this.extraParams == null) {
			this.extraParams = new HashMap<>();
		}
		this.extraParams.put(key, value);
	}

	public Object getExtraParam(String key) {
		if (this.extraParams == null) {
			return null;
		}
		return this.extraParams.get(key);

	}

	public List<ParamConstraint> getConstraints() {
		return this.constraints;
	}

	public void setConstraints(List<ParamConstraint> constraints) {
		this.constraints = constraints;
	}

	public void addConstraint(ParamConstraint constraint) {
		if (this.constraints == null) {
			this.constraints = new ArrayList<>();
		}
		this.constraints.add(constraint);

	}

	public void addConstraint(String paramName, String maxId, String maxValue, Integer required, int type) {
		if (this.constraints == null) {
			this.constraints = new ArrayList<>();
		}
		ParamConstraint constraint = new ParamConstraint(paramName, maxId, maxValue, required, type);

		this.constraints.add(constraint);

	}

	public int getNumCols() {
		return this.numCols;
	}

	public void setNumCols(int numCols) {
		this.numCols = numCols;
	}

	public long getRoleId() {
		return this.roleId;
	}

	public void setRoleId(long roleId) {
		this.roleId = roleId;
	}

	public long getStaffId() {
		return this.staffId;
	}

	public void setStaffId(long staffId) {
		this.staffId = staffId;
	}

	public String getOutFileName() {
		return this.outFileName;
	}

	public void setOutFileName(String outFileName) {
		this.outFileName = outFileName;
	}

	public short getRowHeight() {
		return this.rowHeight;
	}

	public void setRowHeight(short rowHeight) {
		this.rowHeight = rowHeight;
	}

}
