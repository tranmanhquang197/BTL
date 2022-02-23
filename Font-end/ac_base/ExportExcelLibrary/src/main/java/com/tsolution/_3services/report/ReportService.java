package com.tsolution._3services.report;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.tsolution._1entities.vo.ReportParameterVO;

public interface ReportService {
	public enum LogCol {
		createUser("createUser"), createDate("createDate"), updateUser("updateUser"), updateDate("updateDate"),;

		private String col;

		LogCol(String c) {
			c = this.col;
		}

		public String getCol() {
			return this.col;
		}
	}

	public enum Action {
		SELECT, INSERT, CHANGE, DELETE
	}

	<T> List<T> findAll(String sql, Pageable pageable, HashMap<String, Object> params, Integer maxResult);

	Integer getRowCount(String sql, HashMap<String, Object> params);

	// tim kiem theo entity tat ca
	<T> Page<T> findAll(T param, Pageable pageable, Integer maxResult) throws Exception;

	<T> List<T> findAll(Class<T> clazz, String sql, HashMap<String, Object> params, Integer maxResult);

	// findall: tim kiem theo resultset, tham so truyen vao la cac tham so goi ham
	<T> List<T> findAll(Pageable pageable, Class<T> clazz, String sql, Object... params) throws Exception;

	// findall: tim kiem theo resultset, tham so truyen vao la 1 list
	<T> List<T> findAll(Pageable pageable, Class<T> clazz, String sql, List<Object> params) throws Exception;

	// findall: tim kiem cau lenh sql viet theo kieu naming, tham so truyen vao la
	// hashmap
	<T> List<T> findAll(Pageable pageable, Class<T> clazz, String sql, HashMap params) throws Exception;

	// getResult: dau ra la resultset va bang ax cot: columns
	ResultSet getResultSet(String sql, List<Object> params, HashMap columnsMap) throws Exception;

	// findAll: tim kiem tham so truyen vao la Resultset
	<T> List<T> findAll(Pageable pageable, Class<T> clazz, ResultSet rs, HashMap columnsMap) throws Exception;

	// tim kiem count phan tu tiep theo
	<T> List<T> findNext(Class<T> clazz, ResultSet rs, HashMap columnsMap, Integer count) throws Exception;

	Long getSequence(String s);

	<T> T save(T entity);

	<Dto, T> Dto save(Dto dto, Class<T> clazz, Action type) throws Exception;

	<T> T find(Class<T> entityClass, Object primaryKey);

	<T> List<T> findByNative(Class<T> clazz, String sql, HashMap<String, Object> params, String mapping,
			Integer maxResult);

	String validateData(Object dto, Action actionType);

	ReportParameterVO getReportParameter(String reportCode) throws Exception;

	<T> List<T> resultSetToList(ResultSet rs, Class<T> clazz) throws SQLException;
}
