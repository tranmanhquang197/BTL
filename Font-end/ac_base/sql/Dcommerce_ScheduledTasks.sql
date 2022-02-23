ALTER TABLE dcommerce.kpi_month
 ADD CONSTRAINT fk_kpimonth_kpi FOREIGN KEY (kpi_id) REFERENCES dcommerce.kpi (id);
 
 ALTER TABLE dcommerce.kpi_month
 ADD CONSTRAINT fk_kpimonth_merchant FOREIGN KEY (merchant_id) REFERENCES merchant (MERCHANT_ID);
 
 ALTER TABLE dcommerce.kpi_month
ADD CONSTRAINT unk_kpimonth UNIQUE KEY(kpi_id,merchant_id,month);

select * from orders;

select * from merchant where PARENT_MARCHANT_ID = 86 and active_date is not null;

select * from KPI where from_date <= sysdate() and ( sysdate() <= to_date or to_date is null );

-- HHPTKB_L2_Active
select m.merchant_id, m.status,
       (select count(1) from merchant m1
        where m1.parent_marchant_id = m.MERCHANT_ID
              AND first_day(sysdate()) <= m1.ACTIVE_DATE
              AND m1.ACTIVE_DATE <= LAST_DAY(sysdate())
              AND exists(select 1 from orders o 
                        where o.merchant_id = m1.MERCHANT_ID
                              AND o.ORDER_DATE >= m1.ACTIVE_DATE)) xCount
from merchant m
where m.merchant_type_id = 1 and m.status = 1;

-- HHPTKB_L2_ReActive
select m.merchant_id, m.status,
       (select count(1) from merchant m1
        where m1.parent_marchant_id = m.MERCHANT_ID
              AND first_day(sysdate()) <= m1.REACTIVE_DATE
              AND m1.REACTIVE_DATE <= LAST_DAY(sysdate())
              AND DATE(DATE_ADD(m1.REACTIVE_DATE, interval -30 DAY)) > DATE(m1.DEACTIVE_DATE)
              AND exists(select 1 from orders o 
                        where o.merchant_id = m1.MERCHANT_ID
                              AND o.ORDER_DATE >= m1.REACTIVE_DATE)) xCount
from merchant m
where m.merchant_type_id = 1 and m.status = 1;

-- HHPTDS_TotalAmountInMonth
select m.merchant_id, m.status,
       (select nvl(sum(o.AMOUNT), 0) from orders o
        where first_day(sysdate()) <= o.ORDER_DATE
              AND o.ORDER_DATE <= LAST_DAY(sysdate())
              AND o.MERCHANT_ID = m.MERCHANT_ID)
from merchant m
where m.merchant_type_id = 1 and m.status = 1;

-- HHPTDS_TotalProductQuantity_BonusPercent
select m.merchant_id, m.status,
       (select nvl(sum(op.quantity), 0)
        from orders o join order_packing op on o.ORDER_ID = op.ORDER_ID
        where first_day(sysdate()) <= o.ORDER_DATE
              AND o.ORDER_DATE <= LAST_DAY(sysdate())
              AND o.MERCHANT_ID = m.MERCHANT_ID
              AND op.IS_INCENTIVE = 0) done,
       (select nvl(sum(o.AMOUNT), 0) from orders o
        where first_day(sysdate()) <= o.ORDER_DATE
              AND o.ORDER_DATE <= LAST_DAY(sysdate())
              AND o.MERCHANT_ID = m.MERCHANT_ID) totalAmount
from merchant m
where m.merchant_type_id = 1 and m.status = 1;

-- HHPTDS_TotalProductQuantity_BonusMMK
select m.merchant_id, m.status,
       (select nvl(sum(op.quantity), 0)
        from orders o join order_packing op on o.ORDER_ID = op.ORDER_ID
        where first_day(sysdate()) <= o.ORDER_DATE
              AND o.ORDER_DATE <= LAST_DAY(sysdate())
              AND o.MERCHANT_ID = m.MERCHANT_ID
              AND op.IS_INCENTIVE = 0)
from merchant m
where m.merchant_type_id = 1 and m.status = 1;


select * from merchant m where m.merchant_type_id = 1 and m.status = 1;
select * from orders where merchant_id = 12607;
select * from order_packing where order_id in (13441, 13442);



select * from kpi_month where first_day(sysdate()) <= month and month <= LAST_DAY(sysdate())
order by kpi_id, merchant_id,done desc;

drop table if exists kpi_month;
CREATE TABLE `kpi_month` (
  `month` date NOT NULL,
  `kpi_id` bigint(20) NOT NULL,
  `merchant_id` bigint(20) NOT NULL,
  `plan` double DEFAULT NULL,
  `done` double DEFAULT NULL,
  `bonus` double DEFAULT NULL,
  `create_user` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `update_user` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `update_date` datetime DEFAULT NULL,
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unk_kpimonth` (`kpi_id`,`merchant_id`,`month`),
  KEY `fk_kpimonth_merchant` (`merchant_id`),
  CONSTRAINT `fk_kpimonth_kpi` FOREIGN KEY (`kpi_id`) REFERENCES `kpi` (`id`),
  CONSTRAINT `fk_kpimonth_merchant` FOREIGN KEY (`merchant_id`) REFERENCES `merchant` (`MERCHANT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
-- PARTITION BY RANGE (month) (
--    PARTITION p_first VALUES LESS THAN (to_days(sysdate())),
--    PARTITION p_future VALUES LESS THAN (MAXVALUE)
-- )
;






select * from merchant where merchant_name is null and merchant_code is null;
SELECT MAKEDATE(EXTRACT(YEAR FROM CURDATE()),1);


select date(km.month) month,
       km.merchant_id, nvl(m.merchant_name, m.merchant_code) merchant_name,
       km.kpi_id, kpi.code kpi_code,
--        km.plan, km.done, km.bonus
       max(km.plan) plan, sum(km.done) done, sum(km.bonus) bonus
from kpi_month km
     join kpi on kpi.id = km.kpi_id
     join merchant m on m.merchant_id = km.merchant_id
where first_day(sysdate()) <= km.month and km.month <= last_day(sysdate())
      and kpi.from_date <= last_day(sysdate())
      and (kpi.to_date is null or kpi.to_date >= first_day(sysdate()))
      and kpi.type = 'HHPTKB_L2_Active'-- 'HHPTDS_TotalAmountInMonth'
group by date(km.month), km.merchant_id, km.kpi_id
order by bonus desc, done desc, m.active_date
;














