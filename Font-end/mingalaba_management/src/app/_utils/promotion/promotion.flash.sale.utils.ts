import {FormGroup} from '@angular/forms';
import {PromotionFlashSaleRangeTimeModel} from '../../_models/promotion/promotionFlashSaleRangeTimeModel';
import {PromotionFlashSaleTimeEnum} from '../../_models/promotion/enums/promotion.flash.sale.time.enum';
import {Promotion} from '../../_models/promotion/promotion.model';
import {PromotionDisplayTypeEnum} from '../../_models/promotion/enums/promotion.display.type.enum';

export class PromotionFlashSaleUtils {

  // flash sale
  static refreshFlashSale(form: FormGroup, promotion: Promotion | null | undefined) {
    if (promotion) {
      const flashSaleArr = promotion.promotionFlashSaleRangeTimes ? promotion.promotionFlashSaleRangeTimes : [];
      // if (flashSaleArr.length > 0) {
      const dateArr = [...new Set(flashSaleArr.map((flashSale: any) => flashSale.fromTime.split(' ')[0]))];
      const rows = [{
        '0h9h': true,
        '9h12h': true,
        '12h15h': true,
        '15h18h': true,
        '18h21h': true,
        '21h24h': true,
        date: ' ',
        total: true,
        isColumnTotal: true
      }];

      const applyDate = new Date(form.get('fromDate')?.value ? (form.get('fromDate')?.value.endsWith('Z')
        ? form.get('fromDate')?.value.replace('Z', '') : form.get('fromDate')?.value) : null);

      // lay toDate theo form
      while (applyDate <= new Date(!!form.get('toDate')?.value ? (form.get('toDate')?.value.endsWith('Z')
        ? form.get('toDate')?.value.replace('Z', '') : form.get('toDate')?.value) : Number.MAX_VALUE)) {
        const stringDate = applyDate.getFullYear() + '-' +
          (applyDate.getMonth() < 9 ? ('0' + (applyDate.getMonth() + 1)) : (applyDate.getMonth() + 1))
          + '-' + (applyDate.getDate() < 10 ? ('0' + (applyDate.getDate())) : (applyDate.getDate()));
        if (dateArr.includes(stringDate)) {
          this.getDataRow(stringDate, flashSaleArr, rows);
        } else {
          rows.push({
            date: stringDate,
            total: true,
            isColumnTotal: false,
            '0h9h': false,
            '9h12h': false,
            '12h15h': false,
            '15h18h': false,
            '18h21h': false,
            '21h24h': false,
          });
        }

        applyDate.setDate(applyDate.getDate() + 1);
      }

      form.get('promotionFlashSaleRangeTimes')?.setValue(rows);

      rows.forEach(row => {
        Object.keys(row).forEach(key => {
          if (!row.isColumnTotal) {
            if (key !== 'total' && key !== 'isColumnTotal' && typeof (row[key]) === 'boolean') {
              PromotionFlashSaleUtils.onColumnChange(row, key, form);
            }
          }
        });
      })
    }
  }

  static getDataRow(fromDate: string, flashSaleArr: any[], rows: any) {
    const row = {
      date: fromDate,
      total: true,
      isColumnTotal: false,
      '0h9h': false,
      '9h12h': false,
      '12h15h': false,
      '15h18h': false,
      '18h21h': false,
      '21h24h': false,
    };

    flashSaleArr.filter(flashSale => flashSale.fromTime?.split(' ')[0] === fromDate)
      .forEach(flashSale => {
        const flashSaleFromTime = new Date(flashSale.fromTime.replace('Z', ''));
        switch (flashSaleFromTime.getHours()) {
          case 0:
            row[PromotionFlashSaleTimeEnum._0H_9H] = true;
            break;
          case 9:
            row[PromotionFlashSaleTimeEnum._9H_12H] = true;
            break;
          case 12:
            row[PromotionFlashSaleTimeEnum._12H_15H] = true;
            break;
          case 15:
            row[PromotionFlashSaleTimeEnum._15H_18H] = true;
            break;
          case 18:
            row[PromotionFlashSaleTimeEnum._18H_21H] = true;
            break;
          case 21:
            row[PromotionFlashSaleTimeEnum._21H_24H] = true;
            break;
          default:
            break;
        }
      });
    Object.keys(row).forEach(key => {
      if (key !== 'total' && key !== 'isColumnTotal' && typeof (row[key]) === 'boolean') {
        row.total = row.total && row[key];
      }
    });

    rows.push(row);
  }

  static onColumnChange(e: any, fieldColumn: string, addEditForm: FormGroup) {
    const dataTable = addEditForm.get('promotionFlashSaleRangeTimes')?.value;
    if (e.isColumnTotal) {
      // update chi tiet truoc
      dataTable.forEach((flashSale: any) => {
        flashSale[fieldColumn] = e[fieldColumn];
      });

      if (!e[fieldColumn]) {
        e.total = false;
        dataTable.forEach((flashSale: any) => {
          flashSale.total = false;
        });
      } else {
        // update total sau
        dataTable.forEach((row: any) => {
          row.total = true;
          Object.keys(row).forEach(key => {
            if (key !== 'total' && key !== 'isColumnTotal' && typeof (row[key]) !== 'string') {
              row.total = row.total && row[key];
            }
          });
        });
      }
    } else {
      const columnTotalRow = dataTable[0];
      if (!e[fieldColumn]) {
        columnTotalRow[fieldColumn] = false;
        columnTotalRow.total = false;
        e.total = false;
      } else {
        let totalColumnCheck = true;
        let totalTableCheck = true;
        dataTable.forEach((flashSale: any) => {
          if (!flashSale.isColumnTotal) {
            e.total = true;
            Object.keys(e).forEach(key => {
              if (key !== 'total' && key !== 'isColumnTotal' && typeof (e[key]) !== 'string') {
                e.total = e.total && e[key];
              }
            });
            totalColumnCheck = totalColumnCheck && flashSale[fieldColumn];
            totalTableCheck = totalTableCheck && flashSale.total;
          }
        });
        columnTotalRow[fieldColumn] = totalColumnCheck;
        Object.keys(columnTotalRow).forEach(key => {
          if (key !== 'total' && typeof (columnTotalRow[key]) !== 'string') {
            totalTableCheck = totalTableCheck && columnTotalRow[key];
          }
        });

        columnTotalRow.total = totalTableCheck;
      }
    }
    addEditForm.get('promotionFlashSaleRangeTimes')?.setValue(dataTable);
  }

  static convertPromotionFlashSaleRangeTimesMatrixToList(promotion: Promotion, promotionFlashSaleRangeTimesMatrix: any[])
    : PromotionFlashSaleRangeTimeModel[] {
    if (promotion.displayType === PromotionDisplayTypeEnum._FLASH_SALE) {
      const temp = promotionFlashSaleRangeTimesMatrix.slice(1, promotionFlashSaleRangeTimesMatrix.length);
      const paramList: PromotionFlashSaleRangeTimeModel[] = [];
      temp.forEach(row => {
        Object.keys(row).forEach(key => {
          const promotionFlashSaleRangeTime = new PromotionFlashSaleRangeTimeModel();
          let fromTime;
          let toTime;
          const dateArr = row.date.split('-');
          if (Number(dateArr[1]) < 10 && dateArr[1].length === 1) {
            dateArr[1] = '0' + dateArr[1];
          }
          if (Number(dateArr[2]) < 10 && dateArr[2].length === 1) {
            dateArr[2] = '0' + dateArr[2];
          }
          row.date = dateArr.join('-');
          // create time for flash sale
          switch (key) {
            case PromotionFlashSaleTimeEnum._0H_9H:
              if (row[key]) {
                fromTime = row.date + ' 00:00:00.000Z';
                toTime = row.date + ' 09:00:00.000Z';
              }

              break;
            case PromotionFlashSaleTimeEnum._9H_12H:
              if (row[key]) {
                fromTime = row.date + ' 09:00:00.000Z';
                toTime = row.date + ' 12:00:00.000Z';
              }
              break;
            case PromotionFlashSaleTimeEnum._12H_15H:
              if (row[key]) {
                fromTime = row.date + ' 12:00:00.000Z';
                toTime = row.date + ' 15:00:00.000Z';
              }
              break;
            case PromotionFlashSaleTimeEnum._15H_18H:
              if (row[key]) {
                fromTime = row.date + ' 15:00:00.000Z';
                toTime = row.date + ' 18:00:00.000Z';
              }
              break;
            case PromotionFlashSaleTimeEnum._18H_21H:
              if (row[key]) {
                fromTime = row.date + ' 18:00:00.000Z';
                toTime = row.date + ' 21:00:00.000Z';
              }
              break;
            case PromotionFlashSaleTimeEnum._21H_24H:
              if (row[key]) {
                fromTime = row.date + ' 21:00:00.000Z';
                toTime = row.date + ' 23:59:59.999Z';
              }
              break;
            default:
              fromTime = '';
              toTime = '';
              break;
          }
          if (fromTime) {
            promotionFlashSaleRangeTime.fromTime = fromTime;
            promotionFlashSaleRangeTime.toTime = toTime;
            promotionFlashSaleRangeTime.promotion = promotion;
            paramList.push(promotionFlashSaleRangeTime);
          }
        });
      });
      return paramList;
    }
    return [];
  }
}
