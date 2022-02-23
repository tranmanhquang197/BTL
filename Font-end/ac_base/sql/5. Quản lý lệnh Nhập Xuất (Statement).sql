SET FOREIGN_KEY_CHECKS = 0;
drop table if exists export_statement_delivery;
drop table if exists export_statement_detail;
drop table if exists export_statement;
drop table if exists import_statement_detail_pallet;
drop table if exists import_statement_detail;
drop table if exists import_statement;
drop table if exists po;
drop table if exists po_detail;
drop table if exists import_po;
drop table if exists import_po_detail;
drop table if exists import_po_detail_pallet;
drop table if exists import_po_qc;
drop table if exists repacking_planning;
drop table if exists repacking_planning_detail;
drop table if exists repacking_planning_detail_pallet;
drop table if exists repacking_planning_detail_repacked;
drop table if exists report_constraint;
drop table if exists report_parameter;
drop table if exists claim;
drop table if exists claim_detail;
drop table if exists claim_image;
drop table if exists generator;
drop table if exists shipping_partner_file;
drop table if exists shipping_partner;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE generator (
  code varchar(255) NOT NULL,
  value text NOT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (code)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO generator (code, value)
          VALUES ('PO_CODE', '0'), ('EXPORT_STATEMENT_CODE', '0'),
                 ('STORE_CODE_DC', '0'), ('STORE_CODE_FC','0'),
                 ('PALLET_CODE', '0');

CREATE TABLE report_constraint (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  PARAM_ID text DEFAULT NULL,
  MAX_PARAM_ID text DEFAULT NULL,
  MAX_VALUE text DEFAULT NULL,
  PARAM_TYPE int(11) DEFAULT NULL,
  IS_REQUIRED int(11) DEFAULT NULL,
  REPORT_CODE text DEFAULT NULL,
  DATA_SRC text DEFAULT NULL,
  PARAM_NAME text DEFAULT NULL,
  DEFAULT_VALUE text DEFAULT NULL,
  MIN_VALUE text DEFAULT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
)ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE report_parameter (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  FORM_CODE tinytext DEFAULT NULL,
  PARAM_LIST text DEFAULT NULL,
  FUNC_NAME text DEFAULT NULL,
  RPT_TEMPLATE_PATH text DEFAULT NULL,
  IS_DYNAMIC text DEFAULT NULL COMMENT '0: Không có cột động, 1: có cột động, 2: có cột động mà đẩy param ra ngoài',
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

insert into report_parameter(id, FORM_CODE, PARAM_LIST, FUNC_NAME, RPT_TEMPLATE_PATH, IS_DYNAMIC, create_date,	create_user,	update_date,	update_user)
          values(1,	'PRINT_PO',	null,	null,	'templates\\',	0,	null,	null,	null,	null);

create table shipping_partner (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address LONGTEXT NOT NULL,
  contract_code VARCHAR(50) NOT NULL,
  tax_code VARCHAR(50) NOT NULL,
  description LONGTEXT DEFAULT NULL,
  status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL, 
  accept_date DATETIME DEFAULT NULL,
  accept_user varchar(255) DEFAULT NULL,
  reject_reason LONGTEXT DEFAULT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8; 

create table shipping_partner_file (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  shipping_partner_id bigint(20) NOT NULL,
  url longtext NOT NULL,
  description longtext DEFAULT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_shippingpartner_shippingpartnerfile FOREIGN KEY (shipping_partner_id) REFERENCES shipping_partner(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8; 

create table po (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  manufacturer_id bigint(20) NOT NULL,
  code varchar(255) UNIQUE NOT NULL,
  QR_code longtext  NOT NULL,
  store_id bigint(20) NOT NULL,
  distributor_id bigint(20) NOT NULL,
  description longtext default null,
  delivery_address varchar(1000) default null,
  status ENUM('NEW', 'APPROVED', 'IMPORTED', 'REJECT', 'ARRIVED_VIETNAM_PORT', 'ARRIVED_MYANMAR_PORT') NOT NULL,
  from_currency_id bigint(20) NOT NULL,
  exchange_rate decimal(9,2) NOT NULL,
  to_currency_id bigint(20) NOT NULL,
  reject_reason longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci default null,
  approve_date datetime default null COMMENT 'Ngày duyệt thực tế',
  approve_user varchar(255) default null,
  arrive_vietnam_port_date datetime default null COMMENT 'Ngày dự kiến đến cảng Việt Nam',
  arrive_vietnam_port_user varchar(255) default null,
  arrived_vietnam_port_date datetime default null COMMENT 'Ngày thực tế đến cảng Việt Nam',
  arrived_vietnam_port_user varchar(255) default null,
  arrive_myanmar_port_date datetime default null COMMENT 'Ngày dự kiến đến cảng Myanmar',
  arrive_myanmar_port_user varchar(255) default null,
  arrived_myanmar_port_date datetime default null COMMENT 'Ngày thực tế đến cảng Myanmar',
  arrived_myanmar_port_user varchar(255) default null,
  arrive_fc_date datetime default null COMMENT 'Ngày dự kiến đến kho FC',
  arrive_fc_user varchar(255) default null,
  import_date datetime default null COMMENT 'Ngày nhận hàng thực tế ở FC',
  import_user varchar(255) default null,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_po_store FOREIGN KEY (store_id) REFERENCES store(id),
  CONSTRAINT fk_po_manufacturer FOREIGN KEY (manufacturer_id) REFERENCES manufacturer(id),
  CONSTRAINT fk_po_distributor FOREIGN KEY (distributor_id) REFERENCES distributor(id),
  CONSTRAINT fk_po_from_currency FOREIGN KEY (to_currency_id) REFERENCES currency(id),
  CONSTRAINT fk_po_to_currency FOREIGN KEY (to_currency_id) REFERENCES currency(id),
  CONSTRAINT fk_po_approve_user FOREIGN KEY (approve_user) REFERENCES users(username),
  CONSTRAINT fk_po_arrived_vietnam_port_user FOREIGN KEY (arrived_vietnam_port_user) REFERENCES users(username),
  CONSTRAINT fk_po_arrived_myanmar_port_user FOREIGN KEY (arrived_myanmar_port_user) REFERENCES users(username),
  CONSTRAINT fk_po_import_user FOREIGN KEY (import_user) REFERENCES users(username),
  CONSTRAINT fk_po_create_user FOREIGN KEY (create_user) REFERENCES users(username)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table po_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  po_id bigint(20) NOT NULL,
  product_id bigint(20) NOT NULL,
  product_packing_id bigint(20) NOT NULL,
  product_packing_price_id bigint(20) NOT NULL,
  quantity bigint(20) NOT NULL,
  vat int(11) NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_podetail_po FOREIGN KEY (po_id) REFERENCES po(id),
  CONSTRAINT fk_podetail_product FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_podetail_productpacking FOREIGN KEY (product_packing_id) REFERENCES product_packing(id),
  CONSTRAINT fk_podetail_productpackingprice FOREIGN KEY (product_packing_price_id) REFERENCES product_packing_price(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table import_po (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  manufacturer_id bigint(20) NOT NULL,
  distributor_id bigint(20) NOT NULL,
  code varchar(255) UNIQUE NOT NULL,
  QR_code longtext  NOT NULL,
  store_id bigint(20) NOT NULL,
  description longtext default null,
  po_id bigint(20) NOT NULL,
  status int(11) NOT NULL COMMENT '0: Mới nhập, 1: Đã đưa vào pallet chờ repacking, 2: Đã đưa ra khỏi pallet',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_importpo_po FOREIGN KEY (po_id) REFERENCES po(id),
  CONSTRAINT fk_importpo_store FOREIGN KEY (store_id) REFERENCES store(id),
  CONSTRAINT fk_importpo_manufacturer FOREIGN KEY (manufacturer_id) REFERENCES manufacturer(id),
  CONSTRAINT fk_importpo_distributor FOREIGN KEY (distributor_id) REFERENCES distributor(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table import_po_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  import_po_id bigint(20) NOT NULL,
  product_id bigint(20) NOT NULL,
  product_packing_id bigint(20) NOT NULL,
  quantity bigint(20) NOT NULL,
  product_packing_price_id bigint(20) NOT NULL,
  po_detail_id bigint(20) NOT NULL,
  expire_date date NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_importpodetail_importpo FOREIGN KEY (import_po_id) REFERENCES import_po(id),
  CONSTRAINT fk_importpodetail_product FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_importpodetail_productpacking FOREIGN KEY (product_packing_id) REFERENCES product_packing(id),
  CONSTRAINT fk_importpodetail_productpackingprice FOREIGN KEY (product_packing_price_id) REFERENCES product_packing_price(id),
  CONSTRAINT fk_importpodetail_podetail FOREIGN KEY (po_detail_id) REFERENCES po_detail(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table import_po_detail_pallet  (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  import_po_id bigint(20) NOT NULL,
  import_po_detail_id bigint(20) NOT NULL,
  pallet_id bigint(20) NOT NULL,
  pallet_detail_id bigint(20) NOT NULL,
  quantity bigint(20) NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_importpodetailpallet_importpo FOREIGN KEY (import_po_id) REFERENCES import_po(id),
  CONSTRAINT fk_importpodetailpallet_importpodetail FOREIGN KEY (import_po_detail_id) REFERENCES import_po_detail(id),
  CONSTRAINT fk_importpodetailpallet_pallet FOREIGN KEY (pallet_id) REFERENCES pallet(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE import_po_qc (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  po_id bigint(20) NOT NULL,
  import_po_id bigint(20) NOT NULL,
  url text NOT NULL COMMENT 'Đường dẫn file QC được upload lên server',
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_importpoqc_po FOREIGN KEY (po_id) REFERENCES po(id),
  CONSTRAINT fk_importpoqc_importpo FOREIGN KEY (import_po_id) REFERENCES import_po(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table repacking_planning (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255) UNIQUE NOT NULL,
  description longtext default null,
  store_id bigint(20) NOT NULL,
  distributor_id bigint(20) NOT NULL,
  status int(11) NOT NULL COMMENT '0: Mới lên plan theo product_packing + quantity(nhỏ hơn tổng quantity của tất cả các pallet), 1: Repacked, 2: Đã tạo lệnh thực nhập',
  planning_date datetime default null,
  planned_date datetime default null,
  repacked_date datetime default null,
  imported_date datetime default null,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_repackingplanning_store FOREIGN KEY (store_id) REFERENCES store(id),
  CONSTRAINT fk_repackingplanning_distributor FOREIGN KEY (distributor_id) REFERENCES distributor(id),
  CONSTRAINT fk_repackingplanning_create_user FOREIGN KEY (create_user) REFERENCES users(username)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table repacking_planning_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  repacking_planning_id bigint(20) NOT NULL,
  product_packing_id bigint(20) NOT NULL,
  expire_date date NOT NULL,
  quantity bigint(20) NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_repackingplanningdetail_repackingplanning FOREIGN KEY (repacking_planning_id) REFERENCES repacking_planning(id),
  CONSTRAINT fk_repackingplanningdetail_productpacking FOREIGN KEY (product_packing_id) REFERENCES product_packing(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table repacking_planning_detail_pallet (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  repacking_planning_detail_id bigint(20) NOT NULL,
  pallet_detail_id bigint(20) NOT NULL,
  quantity bigint(20) NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_repackingplanningdetailpallet_repackingplanningdetail FOREIGN KEY (repacking_planning_detail_id) REFERENCES repacking_planning_detail(id),
  CONSTRAINT fk_repackingplanningdetailpallet_palletdetail FOREIGN KEY (pallet_detail_id) REFERENCES pallet_detail(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table repacking_planning_detail_repacked (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  repacking_planning_detail_id bigint(20) NOT NULL,
  code varchar(255) NOT NULL,
  QR_code longtext  NOT NULL,
  product_packing_id bigint(20) NOT NULL,
  expire_date date NOT NULL,
  quantity bigint(20) NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_repackingplanningdetailrepacked_repackingplanningdetail FOREIGN KEY (repacking_planning_detail_id) REFERENCES repacking_planning_detail(id),
  CONSTRAINT fk_repackingplanningdetailrepacked_productpacking FOREIGN KEY (product_packing_id) REFERENCES product_packing(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


# Trường hợp lệnh xuất hàng giữa các kho: tức toStore is not null
#   khi mới tạo thì kiểm tra tồn kho của fromStore rồi trừ luôn số lượng rồi đưa status về = 1
#   Khi tạo mới lệnh nhập hàng từ lệnh xuất hàng thành công thì cập nhật status về = 2
#   Khi Status = 1: Chỉ có thể hủy và cộng lại kho cho fromStore => Status = 3
#   Khi Status = 2: Chỉ có thể trả hàng và lúc này sẽ tạo phiếu xuất khác với fromStore và ToStore đảo ngược
# Trường hợp lệnh xuất hàng giữa Store vs Merchant:
#   Khi Store đủ hàng thì đưa Status = 1
#   Khi Store thiếu hàng thì đưa Status = 0 (Mỗi khi kho có lệnh nhập sẽ kiểm tra để update lại các lệnh xuất thiếu hàng để đưa về Status = 1)
create table export_statement (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  from_store_id bigint(20) NOT NULL COMMENT 'Không thể NULL với mọi trường hợp',
  to_store_id bigint(20) default null COMMENT 'Có thể NULL với trường hợp là DC xuất hàng trả đơn cho Merchant',
--   merchant_id bigint(20) default null COMMENT 'Có thể NULL với trường hợp là FC/DC xuất hàng cho DC',
  merchant_code varchar(255) default null COMMENT 'Có thể NULL với trường hợp là FC/DC xuất hàng cho DC',
  code varchar(255) UNIQUE NOT NULL,
  QR_code longtext  NOT NULL,
  description longtext default null,
--   order_id bigint(20) default null COMMENT 'ID đơn hàng từ hệ thống dcommerce đẩy sang khi merchant tạo đơn hàng',
  merchant_order_id bigint(20) default null COMMENT 'Link lệnh xuất hàng cho đơn hàng từ đại lý cấp 1',
  merchant_order_from_dc text default null COMMENT 'Danh sách ID các đơn hàng gom theo từng DC với tình trạng là thiếu hàng',
  total bigint(20) default null COMMENT 'Tổng tiền của đơn xuất từ DC cho merchant',
  status int(1) default null COMMENT '0: mới tạo lệnh xuất chưa thực xuất, 1: đã tạo lệnh thực xuất chưa có lệnh nhập tương ứng, 2: đang được thực thi (2.1: Đã tạo lệnh nhập nhưng chưa thực nhập, 2.2: Tạo lệnh từ Merchant_order), 3: được hoàn thành thực nhập/thực xuất cho merchant, 4: phiếu bị hủy, 5: phiếu bị trả lại',
  export_date datetime NOT NULL COMMENT 'Ngày tạo lệnh xuất',
  estimated_time_of_arrival date NOT NULL COMMENT 'Ngày dự kiến hàng đến kho nhận',
  shipping_partner_id bigint(20) DEFAULT NULL COMMENT 'Đối tác vận chuyển chỉ sử dụng với lệnh xuất SO dạng SHIPPING',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_exportstatement_fromstore FOREIGN KEY (from_store_id) REFERENCES store(id),
  CONSTRAINT fk_exportstatement_tostore FOREIGN KEY (to_store_id) REFERENCES store(id),
  CONSTRAINT fk_exportstatement_merchantorder FOREIGN KEY (merchant_order_id) REFERENCES merchant_order(id),
--   CONSTRAINT fk_exportstatement_merchant FOREIGN KEY (merchant_id) REFERENCES merchant(id)
  CONSTRAINT fk_exportstatement_shippingpartner FOREIGN KEY (shipping_partner_id) REFERENCES shipping_partner(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


create table export_statement_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  export_statement_id bigint(20) NOT NULL,
  store_product_packing_detail_id bigint(20) NOT NULL,
  pallet_detail_id bigint(20) DEFAULT NULL,
  product_packing_id bigint(20) NOT NULL,
  expire_date date NOT NULL,
  product_packing_price double default null,
  quantity bigint(20) NOT NULL,
  export_date datetime NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_exportstatementdetail_exportstatement FOREIGN KEY (export_statement_id) REFERENCES export_statement(id),
  CONSTRAINT fk_exportstatementdetail_storeproductpackingdetail FOREIGN KEY (store_product_packing_detail_id) REFERENCES store_product_packing_detail(id),
  CONSTRAINT fk_exportstatementdetail_productpacking FOREIGN KEY (product_packing_id) REFERENCES product_packing(id),
  CONSTRAINT fk_exportstatementdetail_palletdetail FOREIGN KEY (pallet_detail_id) REFERENCES pallet_detail(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table export_statement_delivery (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  export_statement_id bigint(20) NOT NULL,
  code varchar(255) UNIQUE NOT NULL,
  QR_code longtext  NOT NULL,
  description longtext default null,
  from_address varchar(1000) NOT NULL,
  from_username varchar(255) NOT NULL,
  from_user_contact varchar(255) NOT NULL,
  from_latitude DECIMAL(10, 8) NOT NULL,
  from_longitude DECIMAL(11, 8) NOT NULL,
  to_address varchar(1000) NOT NULL,
  to_username varchar(255) NOT NULL,
  to_user_contact varchar(255) NOT NULL,
  to_latitude DECIMAL(10, 8) NOT NULL,
  to_longitude DECIMAL(11, 8) NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_exportstatementdelivery_exportstatement FOREIGN KEY (export_statement_id) REFERENCES export_statement(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


create table import_statement (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  from_store_id bigint(20) default NULL COMMENT 'Có thể NULL với trường hợp là FC nhập hàng',
  to_store_id bigint(20) NOT NULL COMMENT 'Không thể NULL với mọi trường hợp',
  code varchar(255) UNIQUE NOT NULL,
  QR_code longtext  NOT NULL,
  description longtext default null,
  import_date datetime NOT NULL,
  repacking_planning_id bigint(20) default null,
  export_statement_id bigint(20) default null,
  status int(1) default null COMMENT '0: Phiếu mới tạo, 1: Phiếu đã thực nhập + đã chọn pallet theo step',
  estimated_time_of_arrival date NOT NULL COMMENT 'Ngày dự kiến hàng đến kho nhận',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_importstatement_fromstore FOREIGN KEY (from_store_id) REFERENCES store(id),
  CONSTRAINT fk_importstatement_tostore FOREIGN KEY (to_store_id) REFERENCES store(id),
  CONSTRAINT fk_importstatement_repackingplanning FOREIGN KEY (repacking_planning_id) REFERENCES repacking_planning(id),
  CONSTRAINT fk_importstatement_exportstatement FOREIGN KEY (export_statement_id) REFERENCES export_statement(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8; 

create table import_statement_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  import_statement_id bigint(20) NOT NULL,
  product_packing_id bigint(20) NOT NULL,
  expire_date date NOT NULL,
  quantity bigint(20) NOT NULL,
  import_date datetime NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_importstatementdetail_importstatement FOREIGN KEY (import_statement_id) REFERENCES import_statement(id),
  CONSTRAINT fk_importstatementdetail_productpacking FOREIGN KEY (product_packing_id) REFERENCES product_packing(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table import_statement_detail_pallet (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  import_statement_id bigint(20) NOT NULL,
  import_statement_detail_id bigint(20) NOT NULL,
  product_packing_id bigint(20) NOT NULL,
  expire_date date NOT NULL,
  quantity bigint(20) NOT NULL,
  pallet_id bigint(20) default NULL COMMENT 'Nếu là FC thì không được null',
  store_product_packing_detail_id bigint(20) NOT NULL,
  pallet_detail_id bigint(20) default null,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_importstatementdetailpallet_importstatement FOREIGN KEY (import_statement_id) REFERENCES import_statement(id),
  CONSTRAINT fk_importstatementdetailpallet_importstatementdetail FOREIGN KEY (import_statement_detail_id) REFERENCES import_statement_detail(id),
  CONSTRAINT fk_importstatementdetailpallet_productpacking FOREIGN KEY (product_packing_id) REFERENCES product_packing(id),
  CONSTRAINT fk_importstatementdetailpallet_storeproductpackingdetail FOREIGN KEY (store_product_packing_detail_id) REFERENCES store_product_packing_detail(id),
  CONSTRAINT fk_importstatementdetailpallet_pallet FOREIGN KEY (pallet_id) REFERENCES pallet(id),
  CONSTRAINT fk_importstatementdetailpallet_palletdetail FOREIGN KEY (pallet_detail_id) REFERENCES pallet_detail(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


create table claim (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255) UNIQUE NOT NULL,
  store_id bigint(20) NOT NULL COMMENT 'Tình trạng đổ vỡ này diễn ra ở kho nào?',
  type ENUM('IMPORT_PO', 'IMPORT_PO_UPDATE_PALLET', 'REPACKING_PLANNING', 'IMPORT_STATEMENT_REPACKING_PLANNING', 'IMPORT_STATEMENT_EXPORT_STATEMENT', 'EXPORT_STATEMENT', 'DELIVERY', 'OUT_OF_DATE_PALLET_STEP_1', 'OUT_OF_DATE_PALLET_STEP_2', 'OTHER') NOT NULL,
  -- IMPORT_PO: Khi NCC đưa hàng đến và kiểm tra hàng ở khu vực nhận hàng
  -- IMPORT_PO_UPDATE_PALLET: Khi đã nhận hàng xong và đưa vào pallet lưu trữ tạm thời
  -- REPACKING_PLANNING: Khi đưa từ khu lưu trữ tạm thời ra để repack và trong quá trình repack
  -- IMPORT_STATEMENT: Trong quá trình thực nhập đưa hàng vào pallet
  -- EXPORT_STATEMENT: Trong quá trình thực xuất đưa hàng ra khỏi kho để vận chuyển
  -- DELIVERY: Trong quá trình vận chuyển giữa các kho
  -- OUT_OF_DATE_PALLET_STEP_1: Hàng hết hạn không kịp đưa ra khỏi pallet ở step 1(Nhận hàng PO)
  -- OUT_OF_DATE_PALLET_STEP_2: Hàng hết hạn không kịp đưa ra khỏi pallet ở step 2(Nhập hàng vào kho)
  -- OTHER: Các tình huống không thuộc tình huống trên (Trộm cắp, hỏa hoạn, ...)
  reference_id bigint(20) default null COMMENT 'ID của các bảng tương ứng ở một vài type có bảng',
  amenable varchar(255) DEFAULT NULL COMMENT 'Người chịu trách nhiệm',
  description longtext default null,
  status int(1) default null COMMENT '0: Chờ duyệt, 1: Đã phê duyệt, 2: Từ chối',
  reject_reason longtext default null,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_claim_store FOREIGN KEY (store_id) REFERENCES store(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8; 

create table claim_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  claim_id bigint(20) NOT NULL,
  product_packing_id bigint(20) NOT NULL,
  expire_date date NOT NULL,
  quantity int(11) NOT NULL,
  product_packing_price_id bigint(20) NOT NULL,
  pallet_detail_id bigint(20) default null COMMENT 'với Type EXPORT_STATEMENT, OUT_OF_DATE_PALLET_STEP_1, OUT_OF_DATE_PALLET_STEP_2, OTHER thì chỉ định lấy hàng chi tiết trong kho để thay thế',
  store_product_packing_detail_id bigint(20) default null,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_claimdetail_claim FOREIGN KEY (claim_id) REFERENCES claim(id),
  CONSTRAINT fk_claimdetail_productpacking FOREIGN KEY (product_packing_id) REFERENCES product_packing(id),
  CONSTRAINT fk_claimdetail_productpackingprice FOREIGN KEY (product_packing_price_id) REFERENCES product_packing_price(id),
  CONSTRAINT fk_claimdetail_palletdetail FOREIGN KEY (pallet_detail_id) REFERENCES pallet_detail(id),
  CONSTRAINT fk_claimdetail_storeproductpackingdetail FOREIGN KEY (store_product_packing_detail_id) REFERENCES store_product_packing_detail(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8; 

-- IMPORT_PO:
--    + product_packing_price_id: Giá tương ứng của po_detail
--    + pallet_detail_id: null
--    + store_product_packing_detail_id: null
-- IMPORT_PO_UPDATE_PALLET:
--    + product_packing_price_id: Giá Hiện tại của sản phẩm
--    + pallet_detail_id: null
--    + store_product_packing_detail_id: null
-- REPACKING_PLANNING: WAIT
-- IMPORT_STATEMENT: WAIT
-- EXPORT_STATEMENT: WAIT
-- DELIVERY: WAIT
-- OUT_OF_DATE_PALLET_STEP_1: WAIT
-- OUT_OF_DATE_PALLET_STEP_2: WAIT
-- OTHER: WAIT

create table claim_image (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  claim_id bigint(20) NOT NULL,
  url longtext NOT NULL,
  description longtext NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_claimimage_claim FOREIGN KEY (claim_id) REFERENCES claim(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8; 



update dcommerce_market_place.currency set IS_SYNCHRONIZATION = 0;
update dcommerce_market_place.distributor set IS_SYNCHRONIZATION = 0;
update dcommerce_market_place.manufacturer set IS_SYNCHRONIZATION = 0;
update dcommerce_market_place.product_type set IS_SYNCHRONIZATION = 0;
update dcommerce_market_place.packing_type set IS_SYNCHRONIZATION = 0;
update dcommerce_market_place.product set IS_SYNCHRONIZATION = 1;
update dcommerce_market_place.product set IS_SYNCHRONIZATION = 0 where distributor_id in (select id from dcommerce_market_place.distributor where code LIKE '20023');
update dcommerce_market_place.app_unit_description set IS_SYNCHRONIZATION = 0;
update dcommerce_market_place.packing_product set IS_SYNCHRONIZATION = 1;
update dcommerce_market_place.packing_product set IS_SYNCHRONIZATION = 0 where product_id in (
  select product_id from dcommerce_market_place.product where distributor_id in (select id from dcommerce_market_place.distributor where code LIKE '20023')
);
update dcommerce_market_place.packing_price set IS_SYNCHRONIZATION = 1;
update dcommerce_market_place.packing_price set IS_SYNCHRONIZATION = 0 where packing_product_id in (
  select packing_product_id from dcommerce_market_place.packing_product where product_id in (
    select product_id from dcommerce_market_place.product where distributor_id in (select id from dcommerce_market_place.distributor where code LIKE '20023')
  )
);

-- select packing_price_id, packing_product_id, currency_id, price_type, from_date, to_date from dcommerce.packing_price
-- order by packing_product_id, currency_id, price_type, from_date;



DELETE FROM oauth2_sso.user_role WHERE (user_id BETWEEN 60 AND 68 OR user_id in (1,2)) OR (role_id BETWEEN 60 AND 68 OR role_id = 1);
DELETE FROM oauth2_sso.app_user WHERE id BETWEEN 60 AND 68 OR id in (1, 2);
INSERT INTO oauth2_sso.app_user (id, first_name, last_name, password, username, enabled)
            VALUES (1, 'Merchant', 'Merchant', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'merchant', 1),
                   (2, 'Admin', 'Admin', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Admin', 1),
                   (60, 'TP', 'Đặt hàng, tối ưu LC', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'TPDH', 1),
                   (61, 'CV', 'Đặt hàng, tối ưu LC', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'CVDH', 1),
                   (62, 'Trưởng kho', 'FC', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'TKFC', 1),
                   (63, 'Nhân viên', 'FC', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'NVFC', 1),
                   (64, 'Trưởng kho', 'DC', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'TKDC', 1),
                   (65, 'Kế toán', 'tổng hợp', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'KTTH', 1),
                   (66, 'Ít', 'Tiền', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'IT', 1),
                   (67, 'Admin', 'SYSTEM', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'AS', 1),
                   (68, 'Q', 'C', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'QC', 1);

DELETE FROM oauth2_sso.role_menu WHERE role_id BETWEEN 60 AND 68 OR role_id = 1 OR menu_id BETWEEN 1 AND 99;
DELETE FROM oauth2_sso.role_permission WHERE role_id BETWEEN 60 AND 68 OR role_id = 1 OR permission_id <= 140;
DELETE FROM oauth2_sso.app_role WHERE id BETWEEN 60 AND 68 OR id = 1;
INSERT INTO oauth2_sso.app_role (id, client_id, role_name, description)
            VALUES (1, 'Logistics', 'MERCHANT', 'Merchant - Has no admin rights'),
                   (60, 'Logistics', 'TPDH', 'Trưởng phòng đặt hàng, tối ưu luân chuyển'),
                   (61, 'Logistics', 'CVDH', 'Chuyên viên đặt hàng, tối ưu luân chuyển'),
                   (62, 'Logistics', 'TKFC', 'Trưởng kho FC'),
                   (63, 'Logistics', 'NVFC', 'Nhân viên FC'),
                   (64, 'Logistics', 'TKDC', 'Trưởng kho DC'),
                   (65, 'Logistics', 'KTTH', 'Kế toán tổng hợp'),
                   (66, 'Logistics', 'IT', 'Ít tiền'),
                   (67, 'Logistics', 'AS', 'Admin System'),
                   (68, 'Logistics', 'QC', 'QC');
                   
INSERT INTO oauth2_sso.user_role(user_id, role_id)
            VALUES(1, 1),(60,60),(61,61),(62,62),(63,63),(64,64),(65,65),(66,66),(67,67),(68,68);

-- select * from oauth2_sso.role_menu where menu_id BETWEEN 1 AND 99;
-- select * from oauth2_sso.app_menu where id BETWEEN 1 AND 99;
-- select * from oauth2_sso.app_menu where parent_menu_id BETWEEN 1 AND 99;
DELETE FROM oauth2_sso.app_menu where id BETWEEN 1 AND 99 AND client_id = 'Logistics' AND parent_menu_id is not null;
DELETE FROM oauth2_sso.app_menu where id BETWEEN 1 AND 99 AND client_id = 'Logistics';
INSERT INTO oauth2_sso.app_menu (id, client_id, app_type, code, url, parent_menu_id)
            VALUES(1, 'Logistics', 'MOBILE', 'CATEGORY', '', null),(2, 'Logistics', 'MOBILE', 'MERCHANT_ORDERs', '', null),
                  (3, 'Logistics', 'MOBILE', 'IMPORT_STATEMENTs', '', null),(4, 'Logistics', 'MOBILE', 'EXPORT_STATEMENTs', '', null),
                  (11, 'Logistics', 'MOBILE', 'MANAGE_FC', '', null),(19, 'Logistics', 'MOBILE', 'LOGOUT', '', null),
                  
                  (5, 'Logistics', 'MOBILE', 'CATEGORY_COUNTRIEs', '', 1),(6, 'Logistics', 'MOBILE', 'CATEGORY_CURRENCIEs', '', 1),
                  (7, 'Logistics', 'MOBILE', 'CATEGORY_STOREs', '', 1),(8, 'Logistics', 'MOBILE', 'CATEGORY_PRODUCTs', '', 1),
                  
                  (9, 'Logistics', 'MOBILE', 'MERCHANT_ORDERs_LIST_MERCHANT_ORDER', '', 2),
                  (10, 'Logistics', 'MOBILE', 'MERCHANT_ORDERs_CREATE_ADJUST_STATEMENT', '', 2),
                  
                  (12, 'Logistics', 'MOBILE', 'IMPORT_STATEMENTs_IMPORT_FROM_EXPORT_STATEMENT', '', 3),
                  (17, 'Logistics', 'MOBILE', 'IMPORT_STATEMENTs_IMPORT_FROM_EXPORT_STATEMENT_RELEASES', '', 3),
                  
                  (18, 'Logistics', 'MOBILE', 'MANAGE_FC_IMPORT_STATEMENTs_FROM_REPACKING_PLANNING', '', 11),
                  (15, 'Logistics', 'MOBILE', 'MANAGE_FC_UPDATE_PALLET', '', 11),
                  
                  (13, 'Logistics', 'MOBILE', 'EXPORT_STATEMENTs_EXPORT_STATEMENT', '', 4),
                  (14, 'Logistics', 'MOBILE', 'EXPORT_STATEMENTs_EXPORT_FROM_MERCHANT_ORDER', '', 4),
                  (16, 'Logistics', 'MOBILE', 'EXPORT_STATEMENTs_RELEASES', '', 4),
                  (21, 'Logistics', 'MOBILE', 'EXPORT_STATEMENTs_DELIVERY', '', 4),
                  
                  (20, 'Logistics', 'MOBILE', 'INVENTORY', '', 1),
                  
                  (22, 'Logistics', 'MOBILE', 'CLAIM', '', null),
                  (23, 'Logistics', 'MOBILE', 'CLAIM_PALLET_STEP_ONE', '', 22),
                  (24, 'Logistics', 'MOBILE', 'CLAIM_PALLET_STEP_TWO', '', 22),
                  (25, 'Logistics', 'MOBILE', 'CLAIM_FIND', '', 22),
                  
                  (26, 'Logistics', 'MOBILE', 'PUCHASEORDER', '', null),
                  (27, 'Logistics', 'MOBILE', 'PUCHASEORDER_LIST', '', 26);
                  
INSERT INTO oauth2_sso.app_menu (id, client_id, app_type, code, url, parent_menu_id)
            VALUES (50, 'Logistics', 'WEB', 'LOGOUT', '', null),(51, 'Logistics', 'WEB', 'CATEGORY', '', null),
                   (52, 'Logistics', 'WEB', 'CATEGORY_STOREs', '', 51),(53, 'Logistics', 'WEB', 'CATEGORY_PALLETs_INVENTORY', '', 51),
                   (54, 'Logistics', 'WEB', 'CATEGORY_INVENTORY', '', 51), (65, 'Logistics', 'WEB', 'CATEGORY_USERs', '', 51),
                   (68, 'Logistics', 'WEB', 'CATEGORY_PALLETs', '', 51),
                   (55, 'Logistics', 'WEB', 'PUCHASEORDER', '', null),
                   (56, 'Logistics', 'WEB', 'PUCHASEORDER_PO', '', 55),(57, 'Logistics', 'WEB', 'PUCHASEORDER_IMPORTPO', '', 55),
                   (58, 'Logistics', 'WEB', 'PUCHASEORDER_REPACKINGPLANNING', '', 55),(59, 'Logistics', 'WEB', 'IMPORTSTATEMENT', '', null),
                   (60, 'Logistics', 'WEB', 'IMPORTSTATEMENT_LIST', '', 59),(61, 'Logistics', 'WEB', 'IMPORTSTATEMENT_CREATE', '', 59),
                   (62, 'Logistics', 'WEB', 'EXPORTSTATEMENT', '', null),(63, 'Logistics', 'WEB', 'EXPORTSTATEMENT_LIST', '', 62),
                   (64, 'Logistics', 'WEB', 'EXPORTSTATEMENT_CREATE', '', 62),(66, 'Logistics', 'WEB', 'MERCHANTORDER', '', null),
                   (67, 'Logistics', 'WEB', 'MERCHANTORDER_STORE_DEMAND', '', null),
                   (69, 'Logistics', 'WEB', 'CLAIM', '', null),
                   (70, 'Logistics', 'WEB', 'EXCHANGE_RATE', '', null);

INSERT INTO oauth2_sso.role_menu(role_id, menu_id)
            VALUES (60, 50),(60, 51),(60, 53),(60, 54),(60, 55),(60, 56),(60, 62),(60, 63),(60, 64),(60, 66),(60, 67),
                   (61, 50),(61, 51),(61, 53),(61, 54),(61, 55),(61, 56),(61, 62),(61, 63),(61, 64),(61, 66),(61, 67),
                   (62, 50),(62, 51),(62, 53),(62, 54),(62, 55),(62, 56),(62, 57),(62, 58),(62, 59),(62, 60),(62, 62),(62, 63),(62, 66),(62,69),
                   (63, 50),(63, 55),(63, 57),(63, 58),(63, 59),(63, 60),(63, 62),(63, 63),
                   (64, 50),(64, 51),(64, 54),(64, 59),(64, 60),(64, 62),(64, 63),(64,69),
                   (65, 50),(65, 51),(65, 53),(65, 54),(65, 55),(65, 56),(65, 57),(65, 58),(65, 59),(65, 60),(65, 62),(65, 63),
                   (66, 50),(66, 51),(66, 52),(66, 65),(66, 68),
                   (67, 50),(67, 51),(67, 52),(67, 65),(67, 68),(67, 70),
                   (68, 50),(68, 69),
                   -- MOBILE
                   (60, 4),(60, 13),(60, 16),(60, 19),
                   (61, 4),(61, 13),(61, 16),(61, 19),
                   (62, 1),(62, 4),(62, 16),(62, 3),(62, 17),(62, 19),(62, 11),(62, 18),(62, 15),(62, 20),(62, 21),(62, 22),(62, 25),
                   (63, 4),(63, 16),(63, 3),(63, 17),(63, 19),(63, 11),(63, 18),(63, 15),(63, 21),(63, 22),(63, 25),
                   (64, 1),(64, 4),(64, 16),(64, 3),(64, 17),(64, 19),(64, 20),(64, 21),(64, 22),(64, 25),
                   (65, 19),(66, 19),(67, 19),
                   (68, 4),(68, 16),(68, 3),(68, 17),(68, 19),(68, 11),(68, 18),(68, 15),(68, 21),(68, 22),(68, 23),(68, 24),(68, 25),(68, 26),(68, 27);

DELETE FROM oauth2_sso.role_permission WHERE permission_id <= 140;
DELETE FROM oauth2_sso.app_permission WHERE id <= 140;
INSERT INTO oauth2_sso.app_permission (id, client_id, url, description) VALUES (119, 'Logistics', 'post/claims', ''),(121, 'Logistics', 'get/claims', ''),(118, 'Logistics', 'get/claims/{id}', ''),(120, 'Logistics', 'patch/claims/{id}', ''),(128, 'Logistics', 'post/claims/{id}/print-pdf', ''),(126, 'Logistics', 'patch/claims/{id}/update-image', ''),(122, 'Logistics', 'patch/claims/accept/{id}', ''),(117, 'Logistics', 'get/claims/all', ''),(125, 'Logistics', 'get/claims/by-reference', ''),(123, 'Logistics', 'patch/claims/reject/{id}', ''),(1, 'Logistics', 'get/countries', ''),(2, 'Logistics', 'post/countries', ''),(3, 'Logistics', 'get/countries/{id}', ''),(4, 'Logistics', 'patch/countries/{id}', ''),(5, 'Logistics', 'get/countries/all', ''),(6, 'Logistics', 'post/distributors', ''),(7, 'Logistics', 'get/distributors/{id}', ''),(8, 'Logistics', 'patch/distributors/{id}', ''),(9, 'Logistics', 'get/distributors/all', ''),(10, 'Logistics', 'post/export-statements', ''),(11, 'Logistics', 'get/export-statements', ''),(12, 'Logistics', 'get/export-statements/{id}', ''),(13, 'Logistics', 'patch/export-statements/{id}', ''),(14, 'Logistics', 'patch/export-statements/{id}/export', ''),(15, 'Logistics', 'post/export-statements/by-store-demand', ''),(16, 'Logistics', 'post/export-statements/cancel/{id}', ''),(17, 'Logistics', 'post/export-statements/cancel-detail/{id}', ''),(18, 'Logistics', 'post/export-statements/from-merchant-order', ''),(19, 'Logistics', 'get/export-statements/get-by-code', ''),(20, 'Logistics', 'post/export-statements/print/{id}', ''),(127, 'Logistics', 'post/export-statements/print-pdf/{id}', ''),(21, 'Logistics', 'post/import-pos', ''),(22, 'Logistics', 'get/import-pos', ''),(23, 'Logistics', 'get/import-pos/{id}', ''),(24, 'Logistics', 'patch/import-pos/{id}', ''),(25, 'Logistics', 'get/import-pos/all', ''),(26, 'Logistics', 'post/import-pos/update-pallet/{id}', ''),(27, 'Logistics', 'post/import-statements', ''),(33, 'Logistics', 'patch/import-statements/{id}', ''),(36, 'Logistics', 'get/import-statements/{id}', ''),(35, 'Logistics', 'patch/import-statements/{id}/import', ''),(28, 'Logistics', 'get/import-statements/find', ''),(29, 'Logistics', 'post/import-statements/from-export-statement', ''),(30, 'Logistics', 'post/import-statements/from-repacking-planning', ''),(31, 'Logistics', 'post/import-statements/import-fc', ''),(34, 'Logistics', 'post/import-statements/print/{id}', ''),(32, 'Logistics', 'get/import-statements/repacking-planning/{id}', ''),(37, 'Logistics', '/languages/all', ''),(38, 'Logistics', 'post/manufacturers', ''),(39, 'Logistics', 'get/manufacturers', ''),(40, 'Logistics', 'get/manufacturers/{id}', ''),(42, 'Logistics', 'patch/manufacturers/{id}', ''),(41, 'Logistics', 'get/manufacturers/all', ''),(43, 'Logistics', 'post/merchant-orders', ''),(44, 'Logistics', 'get/merchant-orders', ''),(45, 'Logistics', 'get/merchant-orders/{code}/status', ''),(51, 'Logistics', 'get/merchant-orders/{id}', ''),(49, 'Logistics', 'post/merchant-orders/cancel/{code}', ''),(46, 'Logistics', 'get/merchant-orders/details', ''),(48, 'Logistics', 'post/merchant-orders/get-inventory', ''),(50, 'Logistics', 'get/merchant-orders/get-inventory', ''),(47, 'Logistics', 'get/merchant-orders/store-exists-not-enough-quantity', ''),(53, 'Logistics', 'post/merchants', ''),(55, 'Logistics', 'get/merchants', ''),(54, 'Logistics', 'get/merchants/{id}', ''),(56, 'Logistics', 'patch/merchants/{id}', ''),(52, 'Logistics', 'get/merchants/all', ''),(58, 'Logistics', 'post/pallets', ''),(60, 'Logistics', 'get/pallets', ''),(59, 'Logistics', 'get/pallets/{id}', ''),(62, 'Logistics', 'patch/pallets/{id}', ''),(57, 'Logistics', 'get/pallets/all', ''),(124, 'Logistics', 'get/pallets/group-by-pallet-product-packing-expire-date', ''),(61, 'Logistics', 'get/pallets/product-packing-group-by-expire-date', ''),(64, 'Logistics', 'post/pos', ''),(65, 'Logistics', 'get/pos', ''),(67, 'Logistics', 'get/pos/{id}', ''),(70, 'Logistics', 'patch/pos/{id}', ''),(63, 'Logistics', 'get/pos/all', ''),(68, 'Logistics', 'patch/pos/approve/{id}', ''),(69, 'Logistics', 'post/pos/print', ''),(66, 'Logistics', 'post/pos/print/{id}', ''),(113, 'Logistics', 'post/pos/print-pdf/{id}', ''),(116, 'Logistics', 'patch/pos/reject/{id}', ''),(71, 'Logistics', 'get/product-packings', ''),(73, 'Logistics', 'post/products', ''),(74, 'Logistics', 'get/products', ''),(75, 'Logistics', 'get/products/{id}', ''),(77, 'Logistics', 'patch/products/{id}', ''),(72, 'Logistics', 'get/products/all', ''),(76, 'Logistics', 'get/products/packing-type', ''),(81, 'Logistics', 'post/repacking-plannings', ''),(82, 'Logistics', 'get/repacking-plannings', ''),(85, 'Logistics', 'get/repacking-plannings/{id}', ''),(88, 'Logistics', 'patch/repacking-plannings/{id}', ''),(78, 'Logistics', 'get/repacking-plannings/all', ''),(79, 'Logistics', 'post/repacking-plannings/cancel-plan/{id}', ''),(80, 'Logistics', 'post/repacking-plannings/cancel-repack/{id}', ''),(86, 'Logistics', 'get/repacking-plannings/detail-repacked/{id}', ''),(83, 'Logistics', 'post/repacking-plannings/print/{id}', ''),(87, 'Logistics', 'post/repacking-plannings/print-qrcode/{id}', ''),(84, 'Logistics', 'post/repacking-plannings/repack/{id}', ''),(102, 'Logistics', 'post/store-delivery-waits', ''),(101, 'Logistics', 'get/store-delivery-waits/{id}', ''),(103, 'Logistics', 'patch/store-delivery-waits/{id}', ''),(100, 'Logistics', 'get/store-delivery-waits/all', ''),(104, 'Logistics', 'get/store-delivery-waits/from-store/{id}', ''),(90, 'Logistics', 'post/stores', ''),(93, 'Logistics', 'get/stores', ''),(94, 'Logistics', 'get/stores/{id}', ''),(99, 'Logistics', 'patch/stores/{id}', ''),(97, 'Logistics', 'patch/stores/activate/{id}', ''),(89, 'Logistics', 'get/stores/all', ''),(96, 'Logistics', 'get/stores/by-provide-store', ''),(98, 'Logistics', 'patch/stores/deactivate/{id}', ''),(92, 'Logistics', 'get/stores/inventory', ''),(114, 'Logistics', 'get/stores/inventory/pallet-details', ''),(95, 'Logistics', 'get/stores/inventory-ignore-expire-date', ''),(91, 'Logistics', 'get/stores/near-here', ''),(115, 'Logistics', 'get/stores/users/{id}', ''),(107, 'Logistics', 'post/users', ''),(109, 'Logistics', 'get/users', ''),(112, 'Logistics', 'patch/users', ''),(110, 'Logistics', 'get/users/{username}', ''),(105, 'Logistics', 'post/users/active', ''),(106, 'Logistics', 'get/users/all', ''),(108, 'Logistics', 'post/users/deactive', ''),(111, 'Logistics', 'post/users/reset-pass', ''),(129, 'Logistics', 'get/currency-exchange-rate/all', ''),(130, 'Logistics', 'get/currency-exchange-rate/{id}', ''),(131, 'Logistics', 'post/currency-exchange-rate', ''),(132, 'Logistics', 'patch/currency-exchange-rate/{id}', ''),(133, 'Logistics', 'get/currency-exchange-rate', ''),(134, 'Logistics', 'get/countries/locations/tree', ''),(135, 'Logistics', 'patch/pos/{id}/arrive-vietnam-port', ''),(136, 'Logistics', 'patch/pos/{id}/arrived-vietnam-port', ''),(137, 'Logistics', 'patch/pos/{id}/arrive-myanmar-port', ''),(138, 'Logistics', 'patch/pos/{id}/arrived-myanmar-port', ''),(139, 'Logistics', 'patch/pos/{id}/arrived-fc', ''),(140, 'Logistics', 'get/claims/list-damaged-goods', '');
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (1, 43), (1, 48), (1, 91);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (60, 9),(60, 10),(60, 11),(60, 12),(60, 13),(60, 15),(60, 16),(60, 17),(60, 39),(60, 44),(60, 51),(60, 46),(60, 50),(60, 47),(60, 60),(60, 59),(60, 61),(60, 64),(60, 65),(60, 67),(60, 70),(60, 68),(60, 69),(60, 66),(60, 113),(60, 116),(60, 71),(60, 93),(60, 96),(60, 92),(60, 95),(60, 133);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (61, 9),(61, 10),(61, 11),(61, 12),(61, 13),(61, 15),(61, 16),(61, 17),(61, 39),(61, 44),(61, 46),(61, 47),(61, 50),(61, 51),(61, 59),(61, 60),(61, 61),(61, 64),(61, 65),(61, 66),(61, 67),(61, 69),(61, 70),(61, 71),(61, 92),(61, 93),(61, 95),(61, 96),(61, 113);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (62, 121),(62, 118),(62, 122),(62, 117),(62, 125),(62, 123),(62, 9),(62, 11),(62, 12),(62, 14),(62, 20),(62, 127),(62, 21),(62, 22),(62, 23),(62, 24),(62, 26),(62, 36),(62, 35),(62, 28),(62, 29),(62, 30),(62, 32),(62, 39),(62, 44),(62, 51),(62, 60),(62, 124),(62, 61),(62, 65),(62, 67),(62, 69),(62, 66),(62, 113),(62, 81),(62, 82),(62, 85),(62, 88),(62, 79),(62, 80),(62, 86),(62, 83),(62, 87),(62, 84),(62, 93),(62, 96),(62, 92),(62, 114),(62, 95),(62, 140);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (63, 121),(63, 118),(63, 125),(63, 9),(63, 11),(63, 12),(63, 14),(63, 22),(63, 23),(63, 24),(63, 26),(63, 36),(63, 35),(63, 28),(63, 29),(63, 30),(63, 32),(63, 39),(63, 60),(63, 61),(63, 82),(63, 85),(63, 86),(63, 93),(63, 96),(63, 95);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (64, 119),(64, 121),(64, 118),(64, 120),(64, 126),(64, 117),(64, 125),(64, 9),(64, 11),(64, 12),(64, 14),(64, 36),(64, 35),(64, 28),(64, 29),(64, 124),(64, 93),(64, 96),(64, 92),(64, 95),(64, 140);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (65, 9),(65, 11),(65, 12),(65, 22),(65, 23),(65, 28),(65, 36),(65, 60),(65, 61),(65, 65),(65, 67),(65, 82),(65, 85),(65, 92),(65, 93),(65, 95),(65, 96);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (66, 5),(66, 9),(66, 58),(66, 60),(66, 59),(66, 62),(66, 90),(66, 93),(66, 94),(66, 99),(66, 98),(66, 115),(66, 107),(66, 109),(66, 112),(66, 110),(66, 106),(66, 108),(66, 111),(66, 134);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (67, 5),(67, 9),(67, 58),(67, 60),(67, 59),(67, 62),(67, 102),(67, 101),(67, 103),(67, 100),(67, 104),(67, 90),(67, 93),(67, 94),(67, 99),(67, 97),(67, 89),(67, 98),(67, 115),(67, 107),(67, 109),(67, 112),(67, 110),(67, 105),(67, 106),(67, 108),(67, 111),(67, 130),(67, 131),(67, 132),(67, 133),(67, 134);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (68, 119),(68, 121),(68, 118),(68, 120),(68, 128),(68, 126),(68, 125),(68, 9),(68, 11),(68, 12),(68, 22),(68, 23),(68, 36),(68, 28),(68, 32),(68, 37),(68, 39),(68, 60),(68, 124),(68, 65),(68, 67),(68, 82),(68, 85),(68, 86),(68, 93),(68, 96);

commit;





