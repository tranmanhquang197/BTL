-- Caused by: com.github.shyiko.mysql.binlog.event.deserialization.EventDataDeserializationException: Failed to deserialize data of EventHeaderV4{timestamp=1542193955000, eventType=GTID, serverId=91111, headerLength=19, dataLength=46, nextPosition=1058898202, flags=0}
-- Caused by: java.lang.RuntimeException: com.github.shyiko.mysql.binlog.event.deserialization.EventDataDeserializationException: Failed to deserialize data of EventHeaderV4{timestamp=1542193955000, eventType=GTID, serverId=91111, headerLength=19, dataLength=46, nextPosition=1058898202, flags=0}
-- Caused by: java.io.EOFException
-- 
-- or
-- 
-- Caused by: java.net.SocketException: Connection reset
-- 
-- set global slave_net_timeout = 120000;
-- set global thread_pool_idle_timeout = 120000;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS bonus_recipients;
DROP TABLE IF EXISTS language;
DROP TABLE IF EXISTS attribute;
DROP TABLE IF EXISTS attribute_value;
DROP TABLE IF EXISTS attribute_value_description;
DROP TABLE IF EXISTS transaction_table;
DROP TABLE IF EXISTS transaction_table_column;
DROP TABLE IF EXISTS transaction_table_mapping_attribute;
DROP TABLE IF EXISTS formular;
DROP TABLE IF EXISTS formular_attribute;
DROP TABLE IF EXISTS input_expression;
DROP TABLE IF EXISTS formular_input_expression;
DROP TABLE IF EXISTS output_expression;
DROP TABLE IF EXISTS compensation_plan;
DROP TABLE IF EXISTS plan_element;
DROP TABLE IF EXISTS plan_element_condition;
DROP TABLE IF EXISTS plan_element_rate;
DROP TABLE IF EXISTS plan_element_rate_operation;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE bonus_recipients (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(2000) DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;
INSERT INTO bonus_recipients(code, name)
      VALUES ('L1', 'L1'), ('L2', 'L2');
	  
CREATE TABLE language (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  updt_id VARCHAR(20) NULL,
  code VARCHAR(255) NOT NULL,
  sort_order INT(11) NULL,
  name VARCHAR(200) NULL,
  source_id VARCHAR(255) NOT NULL COMMENT 'ID reference with SOURCE',
  status ENUM('DELETED', 'ACTIVE', 'INACTIVE') NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

INSERT INTO language(code, name,source_id,sort_order, status) VALUES ('vi','vi',1,1,'ACTIVE'),'en','en',2,2,'ACTIVE'),'my','my',3,3,'ACTIVE');

CREATE TABLE attribute (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(2000) DEFAULT NULL COMMENT '
      Yêu cầu hệ thống tích hợp phải trả về dữ liệu dạng:
      {"value": ...<UNIQUE CODE>..., "displayValue": ...<Friendly display text>..., "children": [...]}
  ',
  root_id BIGINT(20) DEFAULT NULL,
  display_type ENUM('ONE_TYPE', 'MULTI_TYPE') DEFAULT 'ONE_TYPE' COMMENT '
      ONE_TYPE: hiển thị dạng cây chọn cho giá trị cùng 1 loại đối tượng,
	  MULTI_TYPE: hiển thị dạng cây và dạng bảng khi chọn giá trị tương ứng
  ',
  base_url TEXT DEFAULT NULL COMMENT 'Có giá trị khi là dữ liệu dạng referent lấy data cho khai báo',
  native_url TEXT DEFAULT NULL,
  method ENUM("GET", "POST") DEFAULT NULL,
  http_param LONGTEXT DEFAULT NULL,
  http_header LONGTEXT DEFAULT NULL,
  body LONGTEXT DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE attribute_value (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  value VARCHAR(255) NOT NULL,
  attribute_id BIGINT(20) NOT NULL REFERENCES attribute(id),
  display_value VARCHAR(1000) NOT NULL,
  parent_id BIGINT(20) REFERENCES attribute_value(id),
  source_id VARCHAR(255) NOT NULL COMMENT 'ID reference with SOURCE',
  status ENUM('DELETED', 'ACTIVE', 'INACTIVE') NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE attribute_value_description (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  attribute_id BIGINT(20) NOT NULL REFERENCES attribute(id),
  attribute_value_id BIGINT(20) NOT NULL REFERENCES attribute_value(id),
  language_id BIGINT(20) NOT NULL REFERENCES language(id),
  value TEXT NOT NULL,
  source_id VARCHAR(255) NOT NULL COMMENT 'ID reference with SOURCE',
  status ENUM('DELETED', 'ACTIVE', 'INACTIVE') NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE transaction_table (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL COMMENT 'Name of the master data table, ETL craw data by Sale/Channel/Marketing or other ways',
  description LONGTEXT DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE transaction_table_column (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  transaction_table_id BIGINT(20) NOT NULL REFERENCES transaction_table(id),
  column_field VARCHAR(255) NOT NULL COMMENT 'Name of transaction table column field',
  friendly_column_name VARCHAR(255) NOT NULL COMMENT 'Friendly name of column field',
  is_show_declare BIT(1) DEFAULT FALSE,
  column_type ENUM('CUSTOM', 'BIGINT(20)', 'DATETIME', 'TEXT', 'INT(11)', 'DATE', 'TIME', 'YEAR', 'DECIMAL(20,2)', 'BIT(1)') NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  UNIQUE KEY unique_transaction_table_column_name (transaction_table_id, column_field)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE transaction_table_mapping_attribute (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  transaction_table_id BIGINT(20) NOT NULL REFERENCES transaction_table(id),
  attribute_id BIGINT(20) NOT NULL REFERENCES attribute(id),
  transaction_table_column_id BIGINT(20) NOT NULL REFERENCES transaction_table_column(id),
  description LONGTEXT DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE formular (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL COMMENT 'User friendly name of the formular',
  process ENUM('INDIVIDUAL', 'BATCH') NOT NULL,
  accumulate BIT(1) NOT NULL,
  `interval` ENUM('DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR') DEFAULT NULL,
  split ENUM('NO_SPLIT', 'NON_PROPORTIONAL', 'PROPORTIONAL') NOT NULL,
  interval_to_date BIT(1) NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE formular_attribute (
  formular_id BIGINT(20) NOT NULL REFERENCES formular(id),
  attribute_id BIGINT(20) NOT NULL REFERENCES attribute(id),
  is_required BIT(1) NOT NULL,
  is_multiple BIT(1) NOT NULL,
  PRIMARY KEY(formular_id, attribute_id)
);

CREATE TABLE input_expression (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  expression VARCHAR(4000) NOT NULL,
  expression_model VARCHAR(4000) NOT NULL,
  transaction_table_id BIGINT(20) NOT NULL REFERENCES transaction_table(id),
  return_type ENUM('FUNC', 'BOOLEAN', 'CUSTOM', 'BIGINT(20)', 'DATETIME', 'TEXT', 'INT(11)', 'DATE', 'TIME', 'YEAR', 'DECIMAL(20,2)', 'BIT(1)') NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE formular_input_expression (
  formular_id BIGINT(20) NOT NULL REFERENCES formular(id),
  input_expression_id BIGINT(20) NOT NULL REFERENCES input_expression(id),
  sequence_number INT(11) NOT NULL COMMENT 'Thứ tự thực hiện của input_expression trong cùng 1 formular', 
  is_show_declare BIT(1) NOT NULL COMMENT 'Xác định input_expression này có được show cho người khai báo không',
  PRIMARY KEY(formular_id, input_expression_id)
);

CREATE TABLE output_expression (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  expression VARCHAR(4000) NOT NULL,
  expression_model VARCHAR(4000) NOT NULL,
  formular_id BIGINT(20) REFERENCES formular(id),
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE compensation_plan (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  mode ENUM('FULL', 'INCREMENTAL') NOT NULL COMMENT '
    Ví dụ: mình cần tính tổng doanh thu 1 tháng * 2% để ra Commission
    Mode Full: tính vào ngày mồng 1 của tháng sau; công thức tính Commission = Sum(Transaction.Value(Date)) Date in (01/03...31/03)
    Công thức tính Incremental Commission = Last_Commission + Sum(Transaction.Value(Date)) Date = Today
  ',
  -- status ENUM('PENDING', 'APPROVED', 'ON_GOING', 'CLOSED', 'REFUSED') NOT NULL,
  bonus_recipients_id BIGINT(20) NOT NULL REFERENCES bonus_recipients(id),
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE plan_element (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL COMMENT 'User friendly name of ther Plan Element',
  payment_group ENUM('SALE', 'CHANNEL', 'MARKETING') NOT NULL,
  calculation_type ENUM('COMMISSION', 'BONUS') NOT NULL,
  effective_from_date DATE NOT NULL,
  effective_to_date DATE NOT NULL,
  quota DECIMAL(20, 2) DEFAULT NULL,
  compensation_plan_id BIGINT(20) NOT NULL REFERENCES compensation_plan(id),
  formular_id BIGINT(20) NOT NULL REFERENCES formular(id),
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE plan_element_condition (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  -- Nếu là cấp điều kiện
  -- operation ENUM('AND', 'OR') DEFAULT NULL COMMENT 'Nếu cần các điều kiện AND OR phức tạp thì mới dùng; đơn giản thì tách ELEMENT',
  plan_element_id BIGINT(20) NOT NULL REFERENCES plan_element(id),
  attribute_id BIGINT(20) NOT NULL REFERENCES attribute(id),
  value VARCHAR(255) NOT NULL,
  display_value LONGTEXT NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE plan_element_rate (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  plan_element_id BIGINT(20) NOT NULL REFERENCES plan_element(id),
  target ENUM('FIXED_AMOUNT', 'PERCENT') NOT NULL,
  rate DECIMAL(20, 2) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE plan_element_rate_operation (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  plan_element_rate_id BIGINT(20) NOT NULL REFERENCES plan_element_rate(id),
  -- Nếu là cấp điều kiện
  operation ENUM('AND', 'OR') DEFAULT NULL,
  -- Nếu là cấp lá bé nhất
  plan_element_rate_operation_condition_id BIGINT(20) DEFAULT NULL COMMENT '
      - Nếu là cấp gốc thì giá trị sẽ null
      - Nếu là cấp cành thì sẽ có Operation và có giá trị liên kết
      - Nếu là cấp lá thì sẽ không có Operation và có gía trị liên kết
  '
      REFERENCES plan_element_rate_operation(id),
  input_expression_id BIGINT(20) DEFAULT NULL REFERENCES input_expression(id),
  from_value DECIMAL(20, 2) DEFAULT NULL,
  to_value DECIMAL(20,2) DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;



