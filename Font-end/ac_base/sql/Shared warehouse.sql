SET FOREIGN_KEY_CHECKS = 0;
drop table if exists organization;
drop table if exists users;
drop table if exists warehouse;
drop table if exists warehouse_user;
drop table if exists warehouse_image;
drop table if exists parcel;
drop table if exists warehouse_price;
drop table if exists warehouse_pallet;
drop table if exists customer;
drop table if exists customer_rent;
drop table if exists customer_rent_detail;
drop table if exists customer_warehouse_volume;
drop table if exists import_statement;
drop table if exists import_statement_detail;
drop table if exists import_statement_detail_description;
drop table if exists export_statement;
drop table if exists export_statement_detail;
SET FOREIGN_KEY_CHECKS = 1;

-- CREATE TABLE xxx (
--   id bigint(20) NOT NULL AUTO_INCREMENT,
--   create_date datetime DEFAULT NULL,
--   create_user varchar(255) DEFAULT NULL,
--   update_date datetime DEFAULT NULL,
--   update_user varchar(255) DEFAULT NULL,
--   PRIMARY KEY (id),
-- )ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- System admin:
--    - Tạo đơn vị tham gia vào hệ thống (Đơn vị đã ký hợp đòng)
--    - Duyệt/từ chối đơn vị tham gia
--    - Tạo người dùng: Nếu người dùng có vai trò thuộc đơn vị nào thì được duyệt đơn vị đó
--    - duyệt/từ chối người dùng
-- IT Boy (itb): Chỉ thiếu quyền duyệt/từ chối so với system admin

-- Nhân viên:
--    - Khai báo thêm/sửa kho WHOLE SALE vs MARKET PLACE
--    - Khai báo thêm/sửa parcel kho WHOLE SALE vs MARKET PLACE
-- Lãnh đạo: có vai trò thuộc đơn vị nào thì được duyệt đơn vị đó
--    - Phê duyệt/từ chối thông tin kho đăng ký
-- Chủ cho thuê kho:
--    - Khai báo thêm/sửa kho thuộc org của nó
-- Thủ kho:
--    - Quản lý nhập/xuất theo kho
-- Khách hàng:
--    - Thuê kho/vị trí
--    - Danh sách kho sắp hết thời gian cho thuê
--    - Quản lý tồn kho/vị trí kho còn trống
--    - Quản lý nhập xuất


-- Organization - Warehouse
-- System admin: Không gắn với cái gì cả?
-- IT Boy: Không gắn với cái gì cả?
-- ==> Bảng users type = 'ADMIN'
-- Nhân viên: Không gắn với cái gì cả?
-- Lãnh đạo: Không gắn với cái gì cả?
-- ==> Bảng users type = 'FAMILY'
-- Thủ kho: gắn với Warehouse
-- ==> Bảng users type 'STORE_KEEPER'
-- Cu li đơn vị cho thuê kho: gắn với Organization (Có thể là công ty ký hợp đồng với mình || Có thể là hộ cá thể thừa đất)
-- Boss đơn vị cho thuê kho: gắn với Organization (Có thể là công ty ký hợp đồng với mình || Có thể là hộ cá thể thừa đất)
-- ==> Bảng users type 'ORGANIZATION'
-- Khách hàng: Không gắn với cái gì cả?
-- ==> Bảng customer


CREATE TABLE organization (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  code varchar(255) UNIQUE NOT NULL,
  name varchar(255) NOT NULL,
  status bit(1) NOT NULL default false
)ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

INSERT INTO organization(id, code, name)
      VALUES (1, 'Next-Solution', 'Next Solution'),
             (2, 'M-Function', 'M-Function'),
             (3, 'Other', 'Other');

CREATE TABLE users (
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (username),
  username varchar(255) NOT NULL,
  organization_id bigint(20) DEFAULT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  tel varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  type ENUM('ADMIN', 'FAMILY', 'ORGANIZATION', 'STORE_KEEPER') NOT NULL,
  status bit(1) NOT NULL default false,
  CONSTRAINT fk_users_organization FOREIGN KEY (organization_id) REFERENCES organization(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into users(username, organization_id, first_name, last_name, tel, email, type, status, create_date, create_user)
      values('ITB', null, 'ITB', 'ITB', 'ITB', 'ITB', 'ADMIN', 1, SYSDATE(), 'AUTO INSERT'),
            ('SA', null, 'SA', 'SA', 'SA', 'SA', 'ADMIN', 1, SYSDATE(), 'AUTO INSERT'),
            ('NV', null, 'NV', 'NV', 'NV', 'NV', 'FAMILY', 1, SYSDATE(), 'AUTO INSERT'),
            ('LD', null, 'LD', 'LD', 'LD', 'LD', 'FAMILY', 1, SYSDATE(), 'AUTO INSERT'),
            ('NVORG1', 1, 'NVORG1', 'NVORG1', 'NVORG1', 'NVORG1', 'ORGANIZATION', 1, SYSDATE(), 'AUTO INSERT'),
            ('LDORG1', 1, 'LDORG1', 'LDORG1', 'LDORG1', 'LDORG1', 'ORGANIZATION', 1, SYSDATE(), 'AUTO INSERT'),
            ('NVORG2', 2, 'NVORG2', 'NVORG2', 'NVORG2', 'NVORG2', 'ORGANIZATION', 1, SYSDATE(), 'AUTO INSERT'),
            ('LDORG2', 2, 'LDORG2', 'LDORG2', 'LDORG2', 'LDORG2', 'ORGANIZATION', 1, SYSDATE(), 'AUTO INSERT'),
            ('NVORG3', 3, 'NVORG3', 'NVORG3', 'NVORG3', 'NVORG3', 'ORGANIZATION', 1, SYSDATE(), 'AUTO INSERT'),
            ('LDORG3', 3, 'LDORG3', 'LDORG3', 'LDORG3', 'LDORG3', 'ORGANIZATION', 1, SYSDATE(), 'AUTO INSERT'),
            ('TK1', null, 'TK1', 'TK1', 'TK1', 'TK1', 'STORE_KEEPER', 1, SYSDATE(), 'AUTO INSERT'),
            ('TK2', null, 'TK2', 'TK2', 'TK2', 'TK2', 'STORE_KEEPER', 1, SYSDATE(), 'AUTO INSERT'),
            ('TK3', null, 'TK3', 'TK3', 'TK3', 'TK3', 'STORE_KEEPER', 1, SYSDATE(), 'AUTO INSERT'),
            ('TK4', null, 'TK4', 'TK4', 'TK4', 'TK4', 'STORE_KEEPER', 1, SYSDATE(), 'AUTO INSERT');


CREATE TABLE warehouse (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  code varchar(255) UNIQUE NOT NULL,
  name varchar(255) NOT NULL,
  description text DEFAULT NULL,
  organization_id bigint(20) NOT NULL,
  address text NOT NULL,
  phone varchar(20) DEFAULT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  area int(11) NOT NULL COMMENT 'diện tích đơn vị M^2',
  percent_in_use int(11) NOT NULL COMMENT '0 - 100 %',
  amount_of_pallets int(11) NOT NULL COMMENT '= area * percent_in_use * 0,7 / 1,44 (pallet = 1,2 * 1,2)',
  total_volume Decimal(20, 2) NOT NULL DEFAULT 0 COMMENT 'Tổng thể tích có thể cho thuê',
  ready_for_rent bit(1) NOT NULL COMMENT '0: Không cho thuê tiếp, 1: Vẫn tiếp tục cho thuê chỉ sau khi admin đã duyệt',
  status int(11) NOT NULL COMMENT '0: Nhân viên mới tạo, 1: Admin đã duyệt đưa vào hoạt động, 2: Đã cho dừng hoạt động',
  contract varchar(255) DEFAULT NULL COMMENT 'Thông tin mã hợp đồng rời bên ngoài để đối chiếu',
  contract_expire_date date DEFAULT NULL COMMENT 'Ngày hết hạn của hợp đồng, phục vụ quét để hạ kho xuống',
  approve_date datetime DEFAULT NULL,
  approve_user varchar(255) DEFAULT NULL,
  CONSTRAINT fk_warehouse_organization FOREIGN KEY (organization_id) REFERENCES organization(id)
)ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

INSERT INTO warehouse(id, code, name, description, organization_id, address, lat, lng, area, percent_in_use, amount_of_pallets, ready_for_rent, status, create_user, create_date )
      VALUES (1, 'W_86', 'W_86_VTS', '', 1, '86 Võ Thị Sáu', 21.005660, 105.854811, 80, 80, 31, 0, 0, 'SYS', CURRENT_TIMESTAMP() ),
             (2, 'W_KN', 'W_KN_PH', '', 1, 'KeangNam, Phạm Hùng', 21.017162, 105.783709, 1000, 90, 437, 0, 0, 'SYS', CURRENT_TIMESTAMP() ),
             (3, 'W_98', 'W_98_NCT', '', 2, '98 Nguyễn Chí Thanh', 21.016934, 105.805804, 80, 80, 31, 0, 0, 'SYS', CURRENT_TIMESTAMP() ),
             (4, 'W_86_1', 'W_86_HN', '', 2, '86A Hoàng Ngân', 21.016934, 105.805804, 80, 80, 31, 0, 0, 'SYS', CURRENT_TIMESTAMP() ),
             (5, 'W_86_2', 'W_86_HN', '', 3, '86B Hoàng Ngân', 21.016934, 105.805804, 80, 80, 31, 0, 0, 'SYS', CURRENT_TIMESTAMP() );


CREATE TABLE warehouse_user (
  warehouse_id bigint(20) NOT NULL,
  username varchar(255) NOT NULL,
  PRIMARY KEY (warehouse_id, username),
  CONSTRAINT fk_warehouseuser_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(id),
  CONSTRAINT fk_warehouseuser_users FOREIGN KEY (username) REFERENCES users(username)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO warehouse_user(warehouse_id, username)
      VALUES (1, 'TK1'), (2, 'TK2'), (3, 'TK3'), (4, 'TK4'), (5, 'TK4');


CREATE TABLE warehouse_image (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  warehouse_id bigint(20) NOT NULL,
  url text NOT NULL,
  description text NOT NULL,
  status bit(1) NOT NULL COMMENT '0: Ảnh đã bị remove có thể sẽ có tiến trình để xóa ảnh sau, 1: Ảnh vẫn còn trong quá trình sử dụng',
  CONSTRAINT fk_warehouseimage_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE parcel (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  code varchar(255) UNIQUE NOT NULL,
  length decimal(9, 2) NOT NULL,
  width decimal(9, 2) NOT NULL,
  height decimal(9, 2) NOT NULL,
  volume decimal(20, 4) NOT NULL COMMENT 'Đơn vị tính là MM^3',
  status bit(1) NOT NULL COMMENT '0: Không được đưa vào sử dụng, 1: Đang được đưa vào sử dụng'
)ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

INSERT INTO parcel (id, code, length, width, height, volume, status, create_user, create_date )
      VALUES (1, 'P1', 1.2, 1.2, 1.8, 1.2*1.2*1.8, 1, 'SYS', CURRENT_TIMESTAMP() ),
             (2, 'P2', 2.4, 2.4, 3.6, 2.4*2.4*3.6, 1, 'SYS', CURRENT_TIMESTAMP() ),
             (3, 'P3', 0.6, 0.6, 0.6, 0.6*0.6*0.6, 1, 'SYS', CURRENT_TIMESTAMP() );

CREATE TABLE warehouse_price (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  warehouse_id bigint(20) NOT NULL,
  parcel_id bigint(20) NOT NULL,
  from_date date NOT NULL,
  to_date date DEFAULT NULL,
  price bigint(20) NOT NULL COMMENT 'Giá thuê tính theo ngày',
  CONSTRAINT fk_warehouseprice_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(id),
  CONSTRAINT fk_warehouseprice_parcel FOREIGN KEY (parcel_id) REFERENCES parcel(id)
)ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

INSERT INTO warehouse_price (id, warehouse_id, parcel_id, from_date, to_date, price, create_user, create_date )
      VALUES (1, 1, 1, CURRENT_TIMESTAMP(), null, 10000, 'SYS', CURRENT_TIMESTAMP() ),
             (2, 1, 2, CURRENT_TIMESTAMP(), null, 20000, 'SYS', CURRENT_TIMESTAMP() ),
             (3, 2, 1, CURRENT_TIMESTAMP(), null, 1000000, 'SYS', CURRENT_TIMESTAMP() ),
             (4, 2, 2, CURRENT_TIMESTAMP(), null, 2000000, 'SYS', CURRENT_TIMESTAMP() ),
             (5, 3, 1, CURRENT_TIMESTAMP(), null, 100000, 'SYS', CURRENT_TIMESTAMP() ),
             (6, 3, 2, CURRENT_TIMESTAMP(), null, 200000, 'SYS', CURRENT_TIMESTAMP() ),
             (7, 4, 1, CURRENT_TIMESTAMP(), null, 100000, 'SYS', CURRENT_TIMESTAMP() ),
             (8, 4, 2, CURRENT_TIMESTAMP(), null, 200000, 'SYS', CURRENT_TIMESTAMP() ),
             (9, 4, 2, '2019-09-01', '2019-10-01', 200000, 'SYS', CURRENT_TIMESTAMP() );
-- select * from warehouse_price;

-- select wp.id, wp.warehouse_id, wp.parcel_id, wp.from_date, wp.to_date, wp.price
-- from parcel p join warehouse_price wp on p.id = wp.parcel_id and wp.warehouse_id in(3, 4)
--           and wp.from_date <= sysdate() and (wp.to_date is null or wp.to_date>= DATE(sysdate()));

CREATE TABLE warehouse_pallet (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  warehouse_id bigint(20) NOT NULL,
  code varchar(255) UNIQUE NOT NULL,
  QR_code longtext NOT NULL,
  description longtext DEFAULT NULL,
  length int(11) NOT NULL DEFAULT 120,
  width int(11) NOT NULL DEFAULT 120,
  height int(11) NOT NULL DEFAULT 200,
  status bit(1) NOT NULL COMMENT '0: Không dùng đến pallet này nữa, 1: vẫn đang trong sử dụng',
  CONSTRAINT fk_warehousepallet_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;



CREATE TABLE customer (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  code varchar(255) UNIQUE NOT NULL COMMENT 'tương ứng với username để đăng nhập',
  name varchar(255) NOT NULL,
  address text NOT NULL,
  phone varchar(20) DEFAULT NULL,
  is_vip bit(1) NOT NULL default false,
  status bit(1) NOT NULL COMMENT '0: Không sử dụng dịch vụ nữa, 1: đang sử dụng dịch vụ'
)ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

INSERT INTO customer(id, code, name, address, phone, status, create_user, create_date )
      VALUES(1, 'CUS1', 'Mr Hiếu', 'Nhà chưa số phố chưa tên nên chưa điền', '0123456789', 1, 'SYS', CURRENT_TIMESTAMP()),
            (2, 'CUS2', 'Gia cát Dự', 'Đoán toàn sai', '9876543210', 1, 'SYS', CURRENT_TIMESTAMP()),
            (3, 'CUS3', 'Đại lý', 'Đại lý', '0987612345', 1, 'SYS', CURRENT_TIMESTAMP());

CREATE TABLE customer_rent (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  customer_id bigint(20) NOT NULL,
  contract varchar(255) DEFAULT NULL COMMENT 'Thông tin mã hợp đồng rời bên ngoài để đối chiếu',
  description longtext DEFAULT NULL,
  from_date date NOT NULL,
  to_date date NOT NULL,
  total_amount decimal(20, 4) NOT NULL COMMENT 'Tổng tiền',
  status int(11) NOT NULL COMMENT '0: NV mới tạo hợp đồng để giữ chỗ, 1: Admin đã duyệt đưa vào sử dụng, 2: Hủy/từ chối',
  CONSTRAINT fk_customerrent_customer FOREIGN KEY (customer_id) REFERENCES customer(id)
)ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO customer_rent(id, customer_id, contract, description, from_date, to_date, total_amount, status )
      VALUES(1, 1, 'xxx', 'xyz', SYSDATE(), STR_TO_DATE('12/12/2012', '%d/%m/%Y'), 6869, 0);     

CREATE TABLE customer_rent_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  customer_rent_id bigint(20) NOT NULL,
  warehouse_id bigint(20) NOT NULL COMMENT 'Kho khách hàng thuê',
  parcel_id bigint(20) NOT NULL COMMENT 'Loại parcel thuê',
  warehouse_price_id bigint(20) NOT NULL COMMENT 'GIÁ tưng ứng với parcel khách hàng thuê ở thời điểm đó',
  quantity int(11) NOT NULL COMMENT 'Số lượng của parcel muốn thuê',
  from_date date NOT NULL,
  to_date date NOT NULL,
  total_amount decimal(20, 4) NOT NULL COMMENT 'Tổng tiền',
  total_volume decimal(20, 4) NOT NULL COMMENT 'Tổng thể tích thuê',
  CONSTRAINT fk_customerrentdetail_customerrent FOREIGN KEY (customer_rent_id) REFERENCES customer_rent(id),
  CONSTRAINT fk_customerrentdetail_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
)ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

INSERT INTO customer_rent_detail(id, customer_rent_id, warehouse_id, parcel_id, warehouse_price_id, quantity, from_date, to_date, total_amount, total_volume )
      VALUES(1, 1, 1, 1, 1, 10, SYSDATE(), STR_TO_DATE('12/12/2012', '%d/%m/%Y'), 100000, 10*1.2*1.2*1.8 );
INSERT INTO customer_rent_detail(id, customer_rent_id, warehouse_id, parcel_id, warehouse_price_id, quantity, from_date, to_date, total_amount, total_volume )
      VALUES(2, 1, 1, 1, 1, 10, SYSDATE(), STR_TO_DATE('12/12/2012', '%d/%m/%Y'), 100000, 10*1.2*1.2*1.8 );
INSERT INTO customer_rent_detail(id, customer_rent_id, warehouse_id, parcel_id, warehouse_price_id, quantity, from_date, to_date, total_amount, total_volume )
      VALUES(3, 1, 1, 1, 1, 10, SYSDATE(), STR_TO_DATE('12/12/2020', '%d/%m/%Y'), 100000, 10*1.2*1.2*1.8 );      


CREATE TABLE customer_warehouse_volume (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  day date NOT NULL,
  customer_id bigint(20) NOT NULL,
  warehouse_id bigint(20) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY  (day, customer_id, warehouse_id),
  total_volume decimal(20, 2) NOT NULL COMMENT 'Tổng thể tích thuê',
  free_volume decimal(20, 2) NOT NULL COMMENT 'Thể tích còn dư để chứa hàng',
  CONSTRAINT fk_customerwarehousevolume_customer FOREIGN KEY (customer_id) REFERENCES customer(id),
  CONSTRAINT fk_customerwarehousevolume_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE import_statement (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  customer_id bigint(20) NOT NULL,
  warehouse_id bigint(20) NOT NULL,
  code varchar(255) UNIQUE NOT NULL COMMENT 'CODE GEN',
  QR_code longtext  NOT NULL COMMENT 'CODE GEN',
  description longtext DEFAULT NULL,
  import_date date DEFAULT NULL COMMENT 'Ngày thực nhập',
  import_user varchar(255) DEFAULT NULL COMMENT 'Người thực nhập',
  status int(11) NOT NULL COMMENT '0: Khách hàng tạo lệnh nhập, 1: Thủ kho đã thực nhập, 2: Hủy/Từ chối',
  CONSTRAINT fk_importstatement_customer FOREIGN KEY (customer_id) REFERENCES customer(id),
  CONSTRAINT fk_importstatement_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE import_statement_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  import_statement_id bigint(20) NOT NULL,
  parcel_id bigint(20) NOT NULL,
  code varchar(255) UNIQUE NOT NULL COMMENT 'CODE GEN',
  QR_code longtext  NOT NULL COMMENT 'CODE GEN',
  warehouse_pallet_id bigint(20) DEFAULT NULL COMMENT 'Cập nhật khi thực nhập',
  status int(11) NOT NULL COMMENT '0: Khách hàng tạo lệnh nhập, 1: Thủ kho đã thực nhập, 2: Khách hàng tạo lệnh xuất, 3: Thủ kho đã thực xuất, 4: Hủy/Từ chối',
  CONSTRAINT fk_importstatementdetail_importstatement FOREIGN KEY (import_statement_id) REFERENCES import_statement(id),
  CONSTRAINT fk_importstatementdetail_parcel FOREIGN KEY (parcel_id) REFERENCES parcel(id),
  CONSTRAINT fk_importstatementdetail_warehousepallet FOREIGN KEY (warehouse_pallet_id) REFERENCES warehouse_pallet(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE import_statement_detail_description (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  import_statement_detail_id bigint(20) NOT NULL,
  product_code varchar(255) NOT NULL,
  product_name varchar(255) NOT NULL,
  quantity int(11) NOT NULL,
  expire_date date DEFAULT NULL,
  CONSTRAINT fk_importstatementdetaildescription_importstatementdetail FOREIGN KEY (import_statement_detail_id) REFERENCES import_statement_detail(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE export_statement (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  customer_id bigint(20) NOT NULL,
  warehouse_id bigint(20) NOT NULL,
  code varchar(255) UNIQUE NOT NULL COMMENT 'CODE GEN',
  QR_code longtext  NOT NULL COMMENT 'CODE GEN',
  description longtext DEFAULT NULL,
  export_date date DEFAULT NULL COMMENT 'Ngày thực xuất',
  export_user varchar(255) DEFAULT NULL COMMENT 'Người thực xuất',
  status int(11) NOT NULL COMMENT '0: Khách hàng tạo lệnh xuất, 1: Thủ kho đã thực xuất, 2: Hủy/Từ chối',
  CONSTRAINT fk_exportstatement_customer FOREIGN KEY (customer_id) REFERENCES customer(id),
  CONSTRAINT fk_exportstatement_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE export_statement_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  export_statement_id bigint(20) NOT NULL,
  import_statement_detail_id bigint(20) NOT NULL,
  parcel_id bigint(20) NOT NULL,
  code varchar(255) UNIQUE NOT NULL COMMENT 'CODE Lấy sẵn từ chi tiết nhập hàng',
  QR_code longtext  NOT NULL COMMENT 'CODE Lấy sẵn từ chi tiết nhập hàng',
  warehouse_pallet_id bigint(20) NOT NULL COMMENT 'Xác định luôn vị trí từ lúc tạo lệnh xuất',
  CONSTRAINT fk_exportstatementdetail_exportstatement FOREIGN KEY (export_statement_id) REFERENCES export_statement(id),
  CONSTRAINT fk_exportstatementdetail_importstatementdetail FOREIGN KEY (import_statement_detail_id) REFERENCES import_statement_detail(id),
  CONSTRAINT fk_exportstatementdetail_parcel FOREIGN KEY (parcel_id) REFERENCES parcel(id),
  CONSTRAINT fk_exportstatementdetail_warehousepallet FOREIGN KEY (warehouse_pallet_id) REFERENCES warehouse_pallet(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;



DELETE FROM oauth2_sso.user_role where user_id between 20 and 36 or role_id between 11 and 18;
DELETE from oauth2_sso.app_user where id between 20 and 36;
INSERT INTO oauth2_sso.app_user (id, first_name, last_name, password, username, enabled)
            VALUES (20, 'ITB', 'ITB', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'ITB', 1),
                   (21, 'SA', 'SA', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'SA', 1),
                   (22, 'NV', 'NV', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'NV', 1),
                   (23, 'LD', 'LD', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'LD', 1),
                   (24, 'NVORG1', 'NVORG1', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'NVORG1', 1),
                   (25, 'LDORG1', 'LDORG1', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'LDORG1', 1),
                   (26, 'NVORG2', 'NVORG2', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'NVORG2', 1),
                   (27, 'LDORG2', 'LDORG2', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'LDORG2', 1),
                   (28, 'NVORG3', 'NVORG3', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'NVORG3', 1),
                   (29, 'LDORG3', 'LDORG3', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'LDORG3', 1),
                   (30, 'TK1', 'TK1', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'TK1', 1),
                   (31, 'TK2', 'TK2', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'TK2', 1),
                   (32, 'TK3', 'TK3', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'TK3', 1),
                   (33, 'TK4', 'TK4', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'TK4', 1),
                   (34, 'CUS1', 'CUS1', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'CUS1', 1),
                   (35, 'CUS2', 'CUS2', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'CUS2', 1),
                   (36, 'CUS3', 'CUS3', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'CUS3', 1);
                   
-- select * from oauth2_sso.app_role where id between 11 and 18;
-- select * from oauth2_sso.role_menu WHERE role_id between 11 and 18;
DELETE FROM oauth2_sso.role_menu WHERE role_id between 11 and 18 or menu_id between 100 and 199;
DELETE FROM oauth2_sso.role_permission WHERE role_id between 11 and 18 or permission_id between 500 and 900;
DELETE from oauth2_sso.app_role where id between 11 and 18;
INSERT INTO oauth2_sso.app_role (id, client_id, role_name, description)
            VALUES (11, 'ShareWarehouse', 'ITB', 'ITB'),
                   (12, 'ShareWarehouse', 'SA', 'SA'),
                   (13, 'ShareWarehouse', 'NV', 'NV'),
                   (14, 'ShareWarehouse', 'LD', 'LD'),
                   (15, 'ShareWarehouse', 'NVORG', 'NVORG'),
                   (16, 'ShareWarehouse', 'LDORG', 'LDORG'),
                   (17, 'ShareWarehouse', 'TK', 'TK'),
                   (18, 'ShareWarehouse', 'CUS', 'CUS');
                   
INSERT INTO oauth2_sso.user_role(user_id, role_id)
            VALUES(20,11),(21,12), -- 'ADMIN'
                  (22,13),(23,14), -- 'FAMILY'
                  (24,15),(25,16),(26,15),(27,16),(28,15),(29,16), -- 'ORGANIZATION'
                  (30,17),(31,17),(32,17),(33,17), -- 'STORE_KEEPER'
                  (34,18),(35,18),(36,18); -- 'CUSTOMER'
            
DELETE FROM oauth2_sso.app_menu where id between 100 and 199 and client_id = 'ShareWarehouse' and parent_menu_id is not null;
DELETE FROM oauth2_sso.app_menu where id between 100 and 199;
INSERT INTO oauth2_sso.app_menu (id, client_id, app_type, code, url, parent_menu_id)
            VALUES(149, 'ShareWarehouse', 'MOBILE', 'LOGOUT', '', null), 
                  (100, 'ShareWarehouse', 'MOBILE', 'WAREHOUSE', '', null), 
                  (101, 'ShareWarehouse', 'MOBILE', 'LIST_WAREHOUSE', '', 100), 
                  (102, 'ShareWarehouse', 'MOBILE', 'CREATE_WAREHOUSE', '', 100), 
                  (103, 'ShareWarehouse', 'MOBILE', 'EXPIRE_WAREHOUSE', '', 100), 
                  
                  (104, 'ShareWarehouse', 'MOBILE', 'RENT_WAREHOUSE', '', null), 
                  (105, 'ShareWarehouse', 'MOBILE', 'APPROVE_RENT_WAREHOUSE', '', 104), 
                  
                  (106, 'ShareWarehouse', 'MOBILE', 'IMPORT_WAREHOUSE', '', null), 
                  (107, 'ShareWarehouse', 'MOBILE', 'CREATE_IMPORT', '', 106), 
                  (108, 'ShareWarehouse', 'MOBILE', 'IMPORT_RELEASE', '', 106), 
                  
                  (109, 'ShareWarehouse', 'MOBILE', 'EXPORT_WAREHOUSE', '', null),   
                  (110, 'ShareWarehouse', 'MOBILE', 'CREATE_EXPORT', '', 109),
                  (111, 'ShareWarehouse', 'MOBILE', 'EXPORT_RELEASE', '', 109),
                  
                  
                  (199, 'ShareWarehouse', 'WEB', 'LOGOUT', '', null), 
                  (150, 'ShareWarehouse', 'WEB', 'CATEGORY', '', null),
                  (151, 'ShareWarehouse', 'WEB', 'CATEGORY_ORGANIZATION', '', 150),
                  (152, 'ShareWarehouse', 'WEB', 'CATEGORY_WAREHOUSE', '', 150),
                  (153, 'ShareWarehouse', 'WEB', 'CATEGORY_USER', '', 150),
                  (154, 'ShareWarehouse', 'WEB', 'CATEGORY_PARCEL', '', 150),
                  (155, 'ShareWarehouse', 'WEB', 'CATEGORY_CUSTOMER', '', 150),
                  
                  (156, 'ShareWarehouse', 'WEB', 'WAREHOUSE_EXPIRE', '', null),
                  (157, 'ShareWarehouse', 'WEB', 'WAREHOUSE_RENT', '', null),
                  (158, 'ShareWarehouse', 'WEB', 'WAREHOUSE_APPROVE_RENT', '', null),
                  (159, 'ShareWarehouse', 'WEB', 'IMPORT_STATEMENT', '', null),
                  (160, 'ShareWarehouse', 'WEB', 'EXPORT_STATEMENT', '', null),
                  (161, 'ShareWarehouse', 'WEB', 'CUSTOMER_RENT', '', null);

-- WEB
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (11, 199),(11, 150),(11, 151),(11, 153),(11, 154),(11, 155);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (12, 199),(12, 150),(12, 151),(12, 153),(12, 154),(12, 155);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (13, 199),(13, 150),(13, 152),(13, 161);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (14, 199),(14, 150),(14, 152),(14, 161);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (15, 199),(15, 150),(15, 152);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (16, 199),(16, 150),(16, 152);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (17, 199);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (18, 199),(18, 161);

-- Mobile
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (11, 149);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (12, 149);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (13, 149),(13, 100),(13, 101),(13, 102);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (14, 149),(14, 100),(14, 101),(14, 102),(14, 103),(14, 105);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (15, 149),(15, 100),(15, 101),(15, 102),(15, 103);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (16, 149),(16, 100),(16, 101),(16, 102),(16, 103);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (17, 149),(17, 106),(17, 108),(17, 109),(17, 111);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (18, 149),(18, 100),(18, 101),(18, 104),(18, 106),(18, 107),(18, 109),(18, 110);


DELETE FROM oauth2_sso.role_permission WHERE permission_id >= 500 and permission_id <= 900;
DELETE FROM oauth2_sso.app_permission where id between 500 and 900;
INSERT INTO oauth2_sso.app_permission (id, client_id, url, description) VALUES (529, 'ShareWarehouse', 'get/customer-rents', ''),(530, 'ShareWarehouse', 'post/customer-rents', ''),(528, 'ShareWarehouse', 'get/customer-rents/{id}', ''),(531, 'ShareWarehouse', 'patch/customer-rents/{id}', ''),(532, 'ShareWarehouse', 'patch/customer-rents/{id}/active', ''),(533, 'ShareWarehouse', 'patch/customer-rents/{id}/deactive', ''),(527, 'ShareWarehouse', 'get/customer-rents/all', ''),(524, 'ShareWarehouse', 'get/customers', ''),(525, 'ShareWarehouse', 'post/customers', ''),(522, 'ShareWarehouse', 'get/customers/{id}', ''),(526, 'ShareWarehouse', 'patch/customers/{id}', ''),(523, 'ShareWarehouse', 'get/customers/{id}/warehouses-rent', ''),(560, 'ShareWarehouse', 'post/customers/active', ''),(521, 'ShareWarehouse', 'get/customers/all', ''),(561, 'ShareWarehouse', 'post/customers/deactivate', ''),(562, 'ShareWarehouse', 'post/customers/reset-pass', ''),(548, 'ShareWarehouse', 'get/customer-warehouse-volumes/nearly-to-expire-over-quota-warehouse', ''),(543, 'ShareWarehouse', 'get/export-statements', ''),(544, 'ShareWarehouse', 'post/export-statements', ''),(542, 'ShareWarehouse', 'get/export-statements/{id}', ''),(545, 'ShareWarehouse', 'patch/export-statements/{id}', ''),(547, 'ShareWarehouse', 'patch/export-statements/{id}/cancel', ''),(546, 'ShareWarehouse', 'patch/export-statements/{id}/export', ''),(541, 'ShareWarehouse', 'get/export-statements/all', ''),(536, 'ShareWarehouse', 'get/import-statements', ''),(537, 'ShareWarehouse', 'post/import-statements', ''),(535, 'ShareWarehouse', 'get/import-statements/{id}', ''),(538, 'ShareWarehouse', 'patch/import-statements/{id}', ''),(540, 'ShareWarehouse', 'patch/import-statements/{id}/cancel', ''),(539, 'ShareWarehouse', 'patch/import-statements/{id}/import', ''),(534, 'ShareWarehouse', 'get/import-statements/all', ''),(502, 'ShareWarehouse', 'post/organizations', ''),(557, 'ShareWarehouse', 'get/organizations', ''),(501, 'ShareWarehouse', 'get/organizations/{id}', ''),(503, 'ShareWarehouse', 'patch/organizations/{id}', ''),(558, 'ShareWarehouse', 'post/organizations/active', ''),(500, 'ShareWarehouse', 'get/organizations/all', ''),(559, 'ShareWarehouse', 'post/organizations/deactivate', ''),(518, 'ShareWarehouse', 'get/parcels', ''),(519, 'ShareWarehouse', 'post/parcels', ''),(517, 'ShareWarehouse', 'get/parcels/{id}', ''),(520, 'ShareWarehouse', 'patch/parcels/{id}', ''),(563, 'ShareWarehouse', 'post/parcels/active', ''),(516, 'ShareWarehouse', 'get/parcels/all', ''),(564, 'ShareWarehouse', 'post/parcels/deactivate', ''),(551, 'ShareWarehouse', 'get/users', ''),(552, 'ShareWarehouse', 'post/users', ''),(553, 'ShareWarehouse', 'patch/users', ''),(550, 'ShareWarehouse', 'get/users/{username}', ''),(554, 'ShareWarehouse', 'post/users/active', ''),(549, 'ShareWarehouse', 'get/users/all', ''),(555, 'ShareWarehouse', 'post/users/deactive', ''),(556, 'ShareWarehouse', 'post/users/reset-pass', ''),(509, 'ShareWarehouse', 'get/warehouses', ''),(510, 'ShareWarehouse', 'post/warehouses', ''),(505, 'ShareWarehouse', 'get/warehouses/{id}', ''),(511, 'ShareWarehouse', 'patch/warehouses/{id}', ''),(514, 'ShareWarehouse', 'patch/warehouses/{id}/active', ''),(508, 'ShareWarehouse', 'get/warehouses/{id}/customer-rents', ''),(515, 'ShareWarehouse', 'patch/warehouses/{id}/deactive', ''),(513, 'ShareWarehouse', 'patch/warehouses/{id}/update-image', ''),(512, 'ShareWarehouse', 'patch/warehouses/{id}/update-price', ''),(507, 'ShareWarehouse', 'get/warehouses/{id}/warehouse-images', ''),(506, 'ShareWarehouse', 'get/warehouses/{id}/warehouse-prices', ''),(504, 'ShareWarehouse', 'get/warehouses/all', ''),(565, 'ShareWarehouse', 'patch/warehouses/org/{id}/active', ''),(566, 'ShareWarehouse', 'patch/warehouses/org/{id}/deactive', ''),(567, 'ShareWarehouse', 'xy', ''),(568, 'ShareWarehouse', 'xy', ''),(569, 'ShareWarehouse', 'xy', ''),(570, 'ShareWarehouse', 'xy', ''),(571, 'ShareWarehouse', 'xy', ''),(572, 'ShareWarehouse', 'xy', ''),(573, 'ShareWarehouse', 'xy', ''),(574, 'ShareWarehouse', 'xy', ''),(575, 'ShareWarehouse', 'xy', ''),(576, 'ShareWarehouse', 'xy', ''),(577, 'ShareWarehouse', 'xy', ''),(578, 'ShareWarehouse', 'xy', ''),(579, 'ShareWarehouse', 'xy', ''),(580, 'ShareWarehouse', 'xy', ''),(581, 'ShareWarehouse', 'xy', ''),(582, 'ShareWarehouse', 'xy', ''),(583, 'ShareWarehouse', 'xy', ''),(584, 'ShareWarehouse', 'xy', ''),(585, 'ShareWarehouse', 'xy', ''),(586, 'ShareWarehouse', 'xy', ''),(587, 'ShareWarehouse', 'xy', ''),(588, 'ShareWarehouse', 'xy', ''),(589, 'ShareWarehouse', 'xy', ''),(590, 'ShareWarehouse', 'xy', ''),(591, 'ShareWarehouse', 'xy', ''),(592, 'ShareWarehouse', 'xy', ''),(593, 'ShareWarehouse', 'xy', ''),(594, 'ShareWarehouse', 'xy', ''),(595, 'ShareWarehouse', 'xy', ''),(596, 'ShareWarehouse', 'xy', ''),(597, 'ShareWarehouse', 'xy', ''),(598, 'ShareWarehouse', 'xy', ''),(599, 'ShareWarehouse', 'xy', ''),(600, 'ShareWarehouse', 'xy', ''),(601, 'ShareWarehouse', 'xy', ''),(602, 'ShareWarehouse', 'xy', ''),(603, 'ShareWarehouse', 'xy', ''),(604, 'ShareWarehouse', 'xy', ''),(605, 'ShareWarehouse', 'xy', ''),(606, 'ShareWarehouse', 'xy', ''),(607, 'ShareWarehouse', 'xy', ''),(608, 'ShareWarehouse', 'xy', ''),(609, 'ShareWarehouse', 'xy', ''),(610, 'ShareWarehouse', 'xy', ''),(611, 'ShareWarehouse', 'xy', ''),(612, 'ShareWarehouse', 'xy', ''),(613, 'ShareWarehouse', 'xy', ''),(614, 'ShareWarehouse', 'xy', ''),(615, 'ShareWarehouse', 'xy', ''),(616, 'ShareWarehouse', 'xy', ''),(617, 'ShareWarehouse', 'xy', ''),(618, 'ShareWarehouse', 'xy', ''),(619, 'ShareWarehouse', 'xy', ''),(620, 'ShareWarehouse', 'xy', ''),(621, 'ShareWarehouse', 'xy', ''),(622, 'ShareWarehouse', 'xy', ''),(623, 'ShareWarehouse', 'xy', ''),(624, 'ShareWarehouse', 'xy', ''),(625, 'ShareWarehouse', 'xy', ''),(626, 'ShareWarehouse', 'xy', ''),(627, 'ShareWarehouse', 'xy', ''),(628, 'ShareWarehouse', 'xy', ''),(629, 'ShareWarehouse', 'xy', ''),(630, 'ShareWarehouse', 'xy', ''),(631, 'ShareWarehouse', 'xy', ''),(632, 'ShareWarehouse', 'xy', ''),(633, 'ShareWarehouse', 'xy', ''),(634, 'ShareWarehouse', 'xy', ''),(635, 'ShareWarehouse', 'xy', ''),(636, 'ShareWarehouse', 'xy', ''),(637, 'ShareWarehouse', 'xy', ''),(638, 'ShareWarehouse', 'xy', ''),(639, 'ShareWarehouse', 'xy', ''),(640, 'ShareWarehouse', 'xy', ''),(641, 'ShareWarehouse', 'xy', ''),(642, 'ShareWarehouse', 'xy', ''),(643, 'ShareWarehouse', 'xy', ''),(644, 'ShareWarehouse', 'xy', ''),(645, 'ShareWarehouse', 'xy', ''),(646, 'ShareWarehouse', 'xy', ''),(647, 'ShareWarehouse', 'xy', ''),(648, 'ShareWarehouse', 'xy', ''),(649, 'ShareWarehouse', 'xy', ''),(650, 'ShareWarehouse', 'xy', ''),(651, 'ShareWarehouse', 'xy', ''),(652, 'ShareWarehouse', 'xy', ''),(653, 'ShareWarehouse', 'xy', ''),(654, 'ShareWarehouse', 'xy', ''),(655, 'ShareWarehouse', 'xy', ''),(656, 'ShareWarehouse', 'xy', ''),(657, 'ShareWarehouse', 'xy', ''),(658, 'ShareWarehouse', 'xy', ''),(659, 'ShareWarehouse', 'xy', ''),(660, 'ShareWarehouse', 'xy', ''),(661, 'ShareWarehouse', 'xy', ''),(662, 'ShareWarehouse', 'xy', ''),(663, 'ShareWarehouse', 'xy', ''),(664, 'ShareWarehouse', 'xy', ''),(665, 'ShareWarehouse', 'xy', ''),(666, 'ShareWarehouse', 'xy', ''),(667, 'ShareWarehouse', 'xy', ''),(668, 'ShareWarehouse', 'xy', ''),(669, 'ShareWarehouse', 'xy', ''),(670, 'ShareWarehouse', 'xy', ''),(671, 'ShareWarehouse', 'xy', ''),(672, 'ShareWarehouse', 'xy', ''),(673, 'ShareWarehouse', 'xy', ''),(674, 'ShareWarehouse', 'xy', ''),(675, 'ShareWarehouse', 'xy', ''),(676, 'ShareWarehouse', 'xy', ''),(677, 'ShareWarehouse', 'xy', ''),(678, 'ShareWarehouse', 'xy', ''),(679, 'ShareWarehouse', 'xy', ''),(680, 'ShareWarehouse', 'xy', ''),(681, 'ShareWarehouse', 'xy', ''),(682, 'ShareWarehouse', 'xy', ''),(683, 'ShareWarehouse', 'xy', ''),(684, 'ShareWarehouse', 'xy', ''),(685, 'ShareWarehouse', 'xy', ''),(686, 'ShareWarehouse', 'xy', ''),(687, 'ShareWarehouse', 'xy', ''),(688, 'ShareWarehouse', 'xy', ''),(689, 'ShareWarehouse', 'xy', ''),(690, 'ShareWarehouse', 'xy', ''),(691, 'ShareWarehouse', 'xy', ''),(692, 'ShareWarehouse', 'xy', ''),(693, 'ShareWarehouse', 'xy', ''),(694, 'ShareWarehouse', 'xy', ''),(695, 'ShareWarehouse', 'xy', ''),(696, 'ShareWarehouse', 'xy', ''),(697, 'ShareWarehouse', 'xy', ''),(698, 'ShareWarehouse', 'xy', ''),(699, 'ShareWarehouse', 'xy', ''),(700, 'ShareWarehouse', 'xy', ''),(701, 'ShareWarehouse', 'xy', ''),(702, 'ShareWarehouse', 'xy', ''),(703, 'ShareWarehouse', 'xy', ''),(704, 'ShareWarehouse', 'xy', ''),(705, 'ShareWarehouse', 'xy', ''),(706, 'ShareWarehouse', 'xy', ''),(707, 'ShareWarehouse', 'xy', ''),(708, 'ShareWarehouse', 'xy', ''),(709, 'ShareWarehouse', 'xy', ''),(710, 'ShareWarehouse', 'xy', ''),(711, 'ShareWarehouse', 'xy', ''),(712, 'ShareWarehouse', 'xy', ''),(713, 'ShareWarehouse', 'xy', ''),(714, 'ShareWarehouse', 'xy', ''),(715, 'ShareWarehouse', 'xy', ''),(716, 'ShareWarehouse', 'xy', ''),(717, 'ShareWarehouse', 'xy', ''),(718, 'ShareWarehouse', 'xy', ''),(719, 'ShareWarehouse', 'xy', ''),(720, 'ShareWarehouse', 'xy', ''),(721, 'ShareWarehouse', 'xy', ''),(722, 'ShareWarehouse', 'xy', ''),(723, 'ShareWarehouse', 'xy', ''),(724, 'ShareWarehouse', 'xy', ''),(725, 'ShareWarehouse', 'xy', ''),(726, 'ShareWarehouse', 'xy', ''),(727, 'ShareWarehouse', 'xy', ''),(728, 'ShareWarehouse', 'xy', ''),(729, 'ShareWarehouse', 'xy', ''),(730, 'ShareWarehouse', 'xy', ''),(731, 'ShareWarehouse', 'xy', ''),(732, 'ShareWarehouse', 'xy', ''),(733, 'ShareWarehouse', 'xy', ''),(734, 'ShareWarehouse', 'xy', ''),(735, 'ShareWarehouse', 'xy', ''),(736, 'ShareWarehouse', 'xy', ''),(737, 'ShareWarehouse', 'xy', ''),(738, 'ShareWarehouse', 'xy', ''),(739, 'ShareWarehouse', 'xy', ''),(740, 'ShareWarehouse', 'xy', ''),(741, 'ShareWarehouse', 'xy', ''),(742, 'ShareWarehouse', 'xy', ''),(743, 'ShareWarehouse', 'xy', ''),(744, 'ShareWarehouse', 'xy', ''),(745, 'ShareWarehouse', 'xy', ''),(746, 'ShareWarehouse', 'xy', ''),(747, 'ShareWarehouse', 'xy', ''),(748, 'ShareWarehouse', 'xy', ''),(749, 'ShareWarehouse', 'xy', ''),(750, 'ShareWarehouse', 'xy', ''),(751, 'ShareWarehouse', 'xy', ''),(752, 'ShareWarehouse', 'xy', ''),(753, 'ShareWarehouse', 'xy', ''),(754, 'ShareWarehouse', 'xy', ''),(755, 'ShareWarehouse', 'xy', ''),(756, 'ShareWarehouse', 'xy', ''),(757, 'ShareWarehouse', 'xy', ''),(758, 'ShareWarehouse', 'xy', ''),(759, 'ShareWarehouse', 'xy', ''),(760, 'ShareWarehouse', 'xy', ''),(761, 'ShareWarehouse', 'xy', ''),(762, 'ShareWarehouse', 'xy', ''),(763, 'ShareWarehouse', 'xy', ''),(764, 'ShareWarehouse', 'xy', ''),(765, 'ShareWarehouse', 'xy', ''),(766, 'ShareWarehouse', 'xy', ''),(767, 'ShareWarehouse', 'xy', ''),(768, 'ShareWarehouse', 'xy', ''),(769, 'ShareWarehouse', 'xy', ''),(770, 'ShareWarehouse', 'xy', ''),(771, 'ShareWarehouse', 'xy', ''),(772, 'ShareWarehouse', 'xy', ''),(773, 'ShareWarehouse', 'xy', ''),(774, 'ShareWarehouse', 'xy', ''),(775, 'ShareWarehouse', 'xy', ''),(776, 'ShareWarehouse', 'xy', ''),(777, 'ShareWarehouse', 'xy', ''),(778, 'ShareWarehouse', 'xy', ''),(779, 'ShareWarehouse', 'xy', ''),(780, 'ShareWarehouse', 'xy', ''),(781, 'ShareWarehouse', 'xy', ''),(782, 'ShareWarehouse', 'xy', ''),(783, 'ShareWarehouse', 'xy', ''),(784, 'ShareWarehouse', 'xy', ''),(785, 'ShareWarehouse', 'xy', ''),(786, 'ShareWarehouse', 'xy', ''),(787, 'ShareWarehouse', 'xy', ''),(788, 'ShareWarehouse', 'xy', ''),(789, 'ShareWarehouse', 'xy', ''),(790, 'ShareWarehouse', 'xy', ''),(791, 'ShareWarehouse', 'xy', ''),(792, 'ShareWarehouse', 'xy', ''),(793, 'ShareWarehouse', 'xy', ''),(794, 'ShareWarehouse', 'xy', ''),(795, 'ShareWarehouse', 'xy', ''),(796, 'ShareWarehouse', 'xy', ''),(797, 'ShareWarehouse', 'xy', ''),(798, 'ShareWarehouse', 'xy', ''),(799, 'ShareWarehouse', 'xy', ''),(800, 'ShareWarehouse', 'xy', ''),(801, 'ShareWarehouse', 'xy', ''),(802, 'ShareWarehouse', 'xy', ''),(803, 'ShareWarehouse', 'xy', ''),(804, 'ShareWarehouse', 'xy', ''),(805, 'ShareWarehouse', 'xy', ''),(806, 'ShareWarehouse', 'xy', ''),(807, 'ShareWarehouse', 'xy', ''),(808, 'ShareWarehouse', 'xy', ''),(809, 'ShareWarehouse', 'xy', ''),(810, 'ShareWarehouse', 'xy', ''),(811, 'ShareWarehouse', 'xy', ''),(812, 'ShareWarehouse', 'xy', ''),(813, 'ShareWarehouse', 'xy', ''),(814, 'ShareWarehouse', 'xy', ''),(815, 'ShareWarehouse', 'xy', ''),(816, 'ShareWarehouse', 'xy', ''),(817, 'ShareWarehouse', 'xy', ''),(818, 'ShareWarehouse', 'xy', ''),(819, 'ShareWarehouse', 'xy', ''),(820, 'ShareWarehouse', 'xy', ''),(821, 'ShareWarehouse', 'xy', ''),(822, 'ShareWarehouse', 'xy', ''),(823, 'ShareWarehouse', 'xy', ''),(824, 'ShareWarehouse', 'xy', ''),(825, 'ShareWarehouse', 'xy', ''),(826, 'ShareWarehouse', 'xy', ''),(827, 'ShareWarehouse', 'xy', ''),(828, 'ShareWarehouse', 'xy', ''),(829, 'ShareWarehouse', 'xy', ''),(830, 'ShareWarehouse', 'xy', ''),(831, 'ShareWarehouse', 'xy', ''),(832, 'ShareWarehouse', 'xy', ''),(833, 'ShareWarehouse', 'xy', ''),(834, 'ShareWarehouse', 'xy', ''),(835, 'ShareWarehouse', 'xy', ''),(836, 'ShareWarehouse', 'xy', ''),(837, 'ShareWarehouse', 'xy', ''),(838, 'ShareWarehouse', 'xy', ''),(839, 'ShareWarehouse', 'xy', ''),(840, 'ShareWarehouse', 'xy', ''),(841, 'ShareWarehouse', 'xy', ''),(842, 'ShareWarehouse', 'xy', ''),(843, 'ShareWarehouse', 'xy', ''),(844, 'ShareWarehouse', 'xy', ''),(845, 'ShareWarehouse', 'xy', ''),(846, 'ShareWarehouse', 'xy', ''),(847, 'ShareWarehouse', 'xy', ''),(848, 'ShareWarehouse', 'xy', ''),(849, 'ShareWarehouse', 'xy', ''),(850, 'ShareWarehouse', 'xy', ''),(851, 'ShareWarehouse', 'xy', ''),(852, 'ShareWarehouse', 'xy', ''),(853, 'ShareWarehouse', 'xy', ''),(854, 'ShareWarehouse', 'xy', ''),(855, 'ShareWarehouse', 'xy', ''),(856, 'ShareWarehouse', 'xy', ''),(857, 'ShareWarehouse', 'xy', ''),(858, 'ShareWarehouse', 'xy', ''),(859, 'ShareWarehouse', 'xy', ''),(860, 'ShareWarehouse', 'xy', ''),(861, 'ShareWarehouse', 'xy', ''),(862, 'ShareWarehouse', 'xy', ''),(863, 'ShareWarehouse', 'xy', ''),(864, 'ShareWarehouse', 'xy', ''),(865, 'ShareWarehouse', 'xy', ''),(866, 'ShareWarehouse', 'xy', ''),(867, 'ShareWarehouse', 'xy', ''),(868, 'ShareWarehouse', 'xy', ''),(869, 'ShareWarehouse', 'xy', ''),(870, 'ShareWarehouse', 'xy', ''),(871, 'ShareWarehouse', 'xy', ''),(872, 'ShareWarehouse', 'xy', ''),(873, 'ShareWarehouse', 'xy', ''),(874, 'ShareWarehouse', 'xy', ''),(875, 'ShareWarehouse', 'xy', ''),(876, 'ShareWarehouse', 'xy', ''),(877, 'ShareWarehouse', 'xy', ''),(878, 'ShareWarehouse', 'xy', ''),(879, 'ShareWarehouse', 'xy', ''),(880, 'ShareWarehouse', 'xy', ''),(881, 'ShareWarehouse', 'xy', ''),(882, 'ShareWarehouse', 'xy', ''),(883, 'ShareWarehouse', 'xy', ''),(884, 'ShareWarehouse', 'xy', ''),(885, 'ShareWarehouse', 'xy', ''),(886, 'ShareWarehouse', 'xy', ''),(887, 'ShareWarehouse', 'xy', ''),(888, 'ShareWarehouse', 'xy', ''),(889, 'ShareWarehouse', 'xy', ''),(890, 'ShareWarehouse', 'xy', ''),(891, 'ShareWarehouse', 'xy', ''),(892, 'ShareWarehouse', 'xy', ''),(893, 'ShareWarehouse', 'xy', ''),(894, 'ShareWarehouse', 'xy', ''),(895, 'ShareWarehouse', 'xy', ''),(896, 'ShareWarehouse', 'xy', ''),(897, 'ShareWarehouse', 'xy', ''),(898, 'ShareWarehouse', 'xy', ''),(899, 'ShareWarehouse', 'xy', ''),(900, 'ShareWarehouse', 'xy', '');
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (11, 524),(11, 525),(11, 522),(11, 526),(11, 502),(11, 557),(11, 501),(11, 503),(11, 500),(11, 518),(11, 517),(11, 551),(11, 552),(11, 553),(11, 550);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (12, 524),(12, 525),(12, 522),(12, 526),(12, 560),(12, 561),(12, 562),(12, 502),(12, 557),(12, 501),(12, 503),(12, 558),(12, 500),(12, 559),(12, 518),(12, 519),(12, 517),(12, 551),(12, 552),(12, 553),(12, 550),(12, 554),(12, 549),(12, 555),(12, 556),(12, 563),(12, 564);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (13, 518),(13, 509),(13, 505),(13, 508),(13, 513),(13, 512),(13, 507),(13, 506);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (14, 529),(14, 528),(14, 532),(14, 533),(14, 524),(14, 548),(14, 518),(14, 509),(14, 505),(14, 514),(14, 508),(14, 515),(14, 513),(14, 512),(14, 507),(14, 506);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (15, 524),(15, 522),(15, 526),(15, 521),(15, 544),(15, 509),(15, 510),(15, 505),(15, 511),(15, 508),(15, 513),(15, 507);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (16, 524),(16, 522),(16, 526),(16, 521),(16, 544),(16, 509),(16, 510),(16, 505),(16, 511),(16, 508),(16, 513),(16, 507),(16, 565),(16, 566);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (17, 544),(17, 541),(17, 558),(17, 500),(17, 559),(17, 519),(17, 520),(17, 563),(17, 516),(17, 564),(17, 552);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (18, 529),(18, 530),(18, 528),(18, 531),(18, 527),(18, 524),(18, 525),(18, 522),(18, 544),(18, 541),(18, 540),(18, 539),(18, 534),(18, 557),(18, 559),(18, 520),(18, 564),(18, 550),(18, 509),(18, 505);






