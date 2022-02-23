package com.tsolution._3services.impl;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.math.BigInteger;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.hibernate.internal.SessionImpl;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsolution._1entities.ReportConstraintEntity;
import com.tsolution._1entities.ReportParameterEntity;
import com.tsolution._1entities.vo.ReportParameterVO;
import com.tsolution._3services.report.ReportService;
import com.tsolution._3services.report.coreRpt.ParamConstraint;
import com.tsolution.utils.Utils;

@Service

@Qualifier("commonService")
public class ReportServiceImpl implements ReportService {

	@PersistenceContext
	protected EntityManager entityManager;

	@Override
	public <T> Page<T> findAll(T param, Pageable pageable, Integer maxResult) throws Exception {
		String sql = String.format(" from %s t where (1=1) ", param.getClass().getName());
		HashMap<String, Object> params = new HashMap<>();
		StringBuilder where = Utils.buildWhere(param, "t ", params);
		Utils.getOtherCond(param);
		String orderBy = (String) params.get("ORDER_BY ");
		sql = sql + where.toString();
		if (orderBy != null) {
			sql += orderBy;

		}
		params.remove("ORDER_BY");
		List<T> lst = Utils.safe(this.findAll(sql, pageable, params, maxResult));
		Integer count = lst.size();

		if ((maxResult == null) || (maxResult == 0)) {
			String sqlCount = String.format("select count(t) from %s t where (1=1) ", param.getClass().getName())
					+ where.toString();
			count = this.getRowCount(sqlCount, params);
		}
		// }
		return new PageImpl<>(lst, pageable, count);

	}

	// findAll: tim kiem theo entity theo pageable
	@Override
	public <T> List<T> findAll(String sql, Pageable pageable, HashMap<String, Object> params, Integer maxResult) {
		Query query = this.entityManager.createQuery(sql);
		if (params != null) {
			for (HashMap.Entry me : params.entrySet()) {
				query.setParameter((String) me.getKey(), me.getValue());
			}
		}

		if ((pageable != null) && ((maxResult == null) || (maxResult == 0))) {
			int firstResult = pageable.getPageNumber() * pageable.getPageSize();
			int maxResults = pageable.getPageSize();

			query.setFirstResult(firstResult);
			query.setMaxResults(maxResults);
		} else if ((maxResult != null) && (maxResult > 0)) {
			query.setMaxResults(maxResult);
		}

		return query.getResultList();
	}

	@Override
	public Integer getRowCount(String sql, HashMap<String, Object> params) {
		Query query = this.entityManager.createQuery(sql);
		if (params != null) {
			for (HashMap.Entry me : params.entrySet()) {
				query.setParameter((String) me.getKey(), me.getValue());
			}
		}
		Number count = (Number) query.getSingleResult();
		if (count == null) {
			count = 0;
		}
		return count.intValue();
	}

	// tim kiem theo entity tat ca
	@Override
	public <T> List<T> findAll(Class<T> clazz, String sql, HashMap<String, Object> params, Integer maxResult) {
		return this.findAll(sql, null, params, maxResult);

	}

	// findall: tim kiem theo resultset, tham so truyen vao la cac tham so goi ham
	@Override
	public <T> List<T> findAll(Pageable pageable, Class<T> clazz, String sql, Object... params) throws Exception {

		sql = this.convertNaming2Quest(sql, null, null);
		List<Object> lstparams = new ArrayList<>();
		if (params != null) {
			for (Object obj : params) {
				lstparams.add(obj);
			}
		}
		HashMap<String, String> columnsMap = new HashMap<>();
		ResultSet rs = this.getResultSet(sql, lstparams, columnsMap);
		return this.findAll(pageable, clazz, rs, columnsMap);
	}

	// findall: tim kiem theo resultset, tham so truyen vao la 1 list
	@Override
	public <T> List<T> findAll(Pageable pageable, Class<T> clazz, String sql, List<Object> params) throws Exception {

		sql = this.convertNaming2Quest(sql, null, null);
		HashMap<String, String> columnsMap = new HashMap<>();
		ResultSet rs = this.getResultSet(sql, params, columnsMap);
		return this.findAll(pageable, clazz, rs, columnsMap);

	}

	// findall: tim kiem cau lenh sql viet theo kieu naming, tham so truyen vao la
	// hashmap
	@Override
	public <T> List<T> findAll(Pageable pageable, Class<T> clazz, String sql, HashMap params) throws Exception {

		List<Object> paramsOut = new ArrayList<>();
		sql = this.convertNaming2Quest(sql, params, paramsOut);
		HashMap<String, String> columnsMap = new HashMap<>();
		ResultSet rs = this.getResultSet(sql, paramsOut, columnsMap);
		return this.findAll(pageable, clazz, rs, columnsMap);

	}

	// getResult: dau ra la resultset va bang ax cot: columns
	@Override
	public ResultSet getResultSet(String sql, List<Object> params, HashMap columnsMap) throws Exception {
		Connection cnn = this.entityManager.unwrap(SessionImpl.class).connection();
		PreparedStatement st = cnn.prepareStatement(sql);
		int i = 1;
		for (Object obj : Utils.safe(params)) {
			st.setObject(i++, obj);
		}

		ResultSet rs = st.executeQuery();
		if ((rs != null) && (columnsMap != null)) {
			ResultSetMetaData metaData = rs.getMetaData();
			columnsMap.putAll(this.loadColumn(metaData));
		}
		return rs;

	}

	// findAll: tim kiem tham so truyen vao la Resultset
	@Override
	public <T> List<T> findAll(Pageable pageable, Class<T> clazz, ResultSet rs, HashMap columnsMap) throws Exception {
		int row = 0;

		List<T> result = new ArrayList<>();
		int firstResult = 0;
		int maxResults = 0;
		if (pageable != null) {
			firstResult = pageable.getPageNumber() * pageable.getPageSize();
			maxResults = firstResult + pageable.getPageSize();
		}
		while (rs.next()) {
			if (row < firstResult) {
				continue;
			}
			if ((maxResults != 0) && (row >= maxResults)) {
				break;
			}
			result.add(this.convert2Class(clazz, rs, columnsMap, row++));
		}
		return result;
	}

	// tim kiem count phan tu tiep theo
	@Override
	public <T> List<T> findNext(Class<T> clazz, ResultSet rs, HashMap columnsMap, Integer count) throws Exception {
		int row = 0;

		List<T> result = new ArrayList<>();

		while (rs.next()) {

			if ((count != 0) && (row >= count)) {
				break;
			}
			result.add(this.convert2Class(clazz, rs, columnsMap, row++));
		}
		return result;

	}

	@Override
	public Long getSequence(String s) {
		s = String.format("select nextval(%s)", s);
		Query q = this.entityManager.createNativeQuery(s);

		Long key = ((BigInteger) q.getSingleResult()).longValue();
		return key;

	}

	@Override
	public <T> T save(T entity) {
		T e = this.entityManager.merge(entity);

		return e;
	}

	@Override
	public <T> T find(Class<T> entityClass, Object primaryKey) {
		return this.entityManager.find(entityClass, primaryKey);
	}

	@Override
	public <T> List<T> findByNative(Class<T> clazz, String sql, HashMap<String, Object> params, String mapping,
			Integer maxResult) {
		Query q = this.entityManager.createNativeQuery(sql, mapping);

		if (params != null) {
			for (HashMap.Entry me : params.entrySet()) {
				System.out.println("Key: " + me.getKey() + " & Value: " + me.getValue());
				q.setParameter((String) me.getKey(), me.getValue());
			}
		}

		return q.getResultList();

	}

	private HashMap loadColumn(ResultSetMetaData metaData) throws Exception {
		HashMap<String, String> columns = new HashMap<>();
		new StringBuilder();
		for (int i = 1; i <= metaData.getColumnCount(); i++) {
			columns.put(metaData.getColumnLabel(i).replaceAll("_", "").toLowerCase(), metaData.getColumnLabel(i));
		}

		return columns;
	}

	public <T> T convert2Class(Class<T> clazz, ResultSet rs, HashMap columnNames, int row) throws Exception {

		Field[] fields = clazz.getDeclaredFields();
		String fieldName;
		T returnClass = clazz.newInstance();
		for (Field field : fields) {
			int modifier = field.getModifiers();
			if (Modifier.isStatic(modifier) || Modifier.isFinal(modifier)) {
				continue;
			}
			if (Modifier.isPrivate(modifier)) {
				field.setAccessible(true);
			}
			fieldName = field.getName();
			String columnName = (String) columnNames.get(fieldName.toLowerCase());
			if (Utils.isNullOrEmpty(columnName)) {
				continue;
			}

			Object value = rs.getObject(columnName, field.getType());

			field.set(returnClass, value);

		}
		return returnClass;
	}

	@Override
	public String validateData(Object dto, Action actionType) {
		return null;
	}

	public String convertNaming2Quest(String sql, HashMap paramIn, List paramsOut) {
		int pos;
		String paramName;
		Object value;
		while ((pos = sql.indexOf(":")) != -1) {
			int end = sql.substring(pos).indexOf(" ");
			if (end == -1) {
				end = sql.length();
			} else {
				end += pos;
			}
			if ((paramIn != null) && (paramsOut != null)) {
				paramName = sql.substring(pos + 1, end);
				value = paramIn.get(paramName);

				paramsOut.add(value);

			}
			sql = sql.substring(0, pos) + "?" + sql.substring(end);
		}
		return sql;
	}

	@Override
	public <Dto, T> Dto save(Dto dto, Class<T> clazz, Action type) throws Exception {

		T instance = clazz.newInstance();
		HashMap<String, Field> destFields = new HashMap<>();
		instance = Utils.getData(dto, clazz, destFields);
		destFields.get(LogCol.createDate);
		Field fieldDate = destFields.get(LogCol.createDate);
		if (type == Action.INSERT) {
			destFields.get(LogCol.createDate);
			fieldDate = destFields.get(LogCol.createDate);
		} else if (type == Action.CHANGE) {
			destFields.get(LogCol.updateUser);
			fieldDate = destFields.get(LogCol.updateDate);
		}
		if (fieldDate != null) {
			fieldDate.setAccessible(true);

			fieldDate.set(instance, Utils.getLocalDatetime());
		}

		this.save(instance);
		return dto;
	}

	@Override
	public ReportParameterVO getReportParameter(String reportCode) throws Exception {
		String sql = "from ReportParameterEntity where formCode = :formCode";
		HashMap<String, Object> params = new HashMap<>();
		params.put("formCode", reportCode);
		List<ReportParameterEntity> rptParams = this.findAll(sql, null, params, 0);
		ReportParameterVO rptParamsVo = new ReportParameterVO();
		rptParamsVo.setParameter(rptParams.get(0));

		// get constraint

		sql = "from ReportConstraintEntity where reportCode = :reportCode";
		params.clear();
		params.put("reportCode", reportCode);
		List<ReportConstraintEntity> lstAllConstraint = this.findAll(sql, null, params, 0);
		List lstParamConstraint = new ArrayList<>();
		String constraintKeys[] = rptParamsVo.paramToList();
		System.out.println("get param" + lstParamConstraint.size());
		for (String constraintKey : constraintKeys) {
			System.out.println("param:" + constraintKey);
			if (Utils.isNullOrEmpty(constraintKey)) {
				continue;
			}
			if ("br".equals(constraintKey)) {
				ParamConstraint tmp = new ParamConstraint();
				tmp.setParamId("br");
				lstParamConstraint.add(tmp);
			}
			for (ReportConstraintEntity constraint : lstAllConstraint) {
				System.out.println("key:" + constraintKey + "_" + constraint.getParamId() + "_");
				if (constraintKey.equals(constraint.getParamId())) {
					System.out.println("add: " + constraint);
//					setDefault(constraint) //tam thoi bo vi chua biet setdefault nhu the nao
					lstParamConstraint.add(constraint);
					break;
				}

			}
		}
		rptParamsVo.setConstraints(lstParamConstraint);

		String outputFile = Utils.toDateString(new Date(), Utils.DATE_FORMAT_EXCEL_FILE) + "_" + reportCode + ".xlsx";
		String realTemplPath = "";
		String realOutFile = "D:\\Downloads\\" + outputFile;

		rptParamsVo.setOutFileName(outputFile);
		rptParamsVo.setRealOutFile(realOutFile);
		rptParamsVo.setRealTemplPath(realTemplPath);
		rptParamsVo.setUseDb(true);

		return rptParamsVo;
	}

	@Override
	public <T> List<T> resultSetToList(ResultSet rs, Class<T> clazz) throws SQLException {
		ResultSetMetaData md = rs.getMetaData();
		int columns = md.getColumnCount();
		List<T> rows = new ArrayList<>();
		while (rs.next()) {
			Map<String, Object> row = new HashMap<>(columns);
			for (int i = 1; i <= columns; ++i) {
				row.put(md.getColumnLabel(i), rs.getObject(i));
			}
			final ObjectMapper mapper = new ObjectMapper(); // jackson's objectmapper
			final T pojo = mapper.convertValue(row, clazz);
			rows.add(pojo);
		}
		return rows;
	}
}
