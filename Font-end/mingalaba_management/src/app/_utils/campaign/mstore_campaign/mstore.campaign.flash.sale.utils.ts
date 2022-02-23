import {PromotionFlashSaleRangeTimeModel} from '../../../_models/promotion/promotionFlashSaleRangeTimeModel';
import {TimeSlotFlashSaleModel} from '../../../components/campaign/mstore-campaign/shared/time-slot-flash-sale-setting/time.slot.flash.sale.model';
import {Promotion} from "../../../_models/promotion/promotion.model";
import {BehaviorSubject} from "rxjs";
import {MStoreCampaignService} from "../../../components/campaign/mstore-campaign/mstore-campaign.service";

export class MstoreCampaignFlashSaleUtils {

  static onColumnChange(e: TimeSlotFlashSaleModel, fieldColumn: string, dataTable: TimeSlotFlashSaleModel[],
                        mstoreCampaignService: MStoreCampaignService) {
    if (!dataTable) {
      return;
    }
    mstoreCampaignService.isEmptyFlashSaleTimes.next(true);
    if (fieldColumn === 'total') {
      Object.keys(e).forEach(key => {
        if (key !== 'total' && typeof (e[key]) !== 'string') {
          e[key] = e.total;
        }
      });
      for (const row of dataTable) {
        Object.keys(row).forEach(key => {
          if (typeof (row[key]) !== 'string') {
            if (mstoreCampaignService.isEmptyFlashSaleTimes.value && !!row[key]){
              mstoreCampaignService.isEmptyFlashSaleTimes.next(false);
            }
          }
        });
        if (!mstoreCampaignService.isEmptyFlashSaleTimes.value){
          break;
        }

      }
      return;
    }
    let totalTableCheck = true;
    dataTable.forEach((flashSale: TimeSlotFlashSaleModel) => {
      if (!flashSale.isColumnTotal) {
        e.total = true;
        Object.keys(e).forEach(key => {
          if (key !== 'total' && typeof (e[key]) !== 'string') {
            e.total = e.total && !!e[key];
            if (mstoreCampaignService.isEmptyFlashSaleTimes.value && !!e[key]) {
              mstoreCampaignService.isEmptyFlashSaleTimes.next(false);
            }
          }
        });
        totalTableCheck = totalTableCheck && !!flashSale.total;
      }
    });
  }

  static convertTimeSlotModelToPromotionFlashSaleModel(timeslots: TimeSlotFlashSaleModel[], promotionId?: number | null): PromotionFlashSaleRangeTimeModel[] {
    if (!timeslots || !timeslots.length) {
      return [];
    }

    const promotionFlashSale: PromotionFlashSaleRangeTimeModel[] = [];

    let formatedDate = '';
    let fromTime = '';
    let toTime = '';

    let timeSlotRangeTime = []; /* [hh:mm:ss] */
    /* timeslot.date = date - month - year */
    timeslots.forEach(timeslot => {
      formatedDate = timeslot.date.split('-').reverse().map(time => Number(time) < 10 ? '0' + Number(time) : time).join('-');
      Object.keys(timeslot).forEach(key => {
        /* key: hh:mm:ss_hh:mm:ss */
        if (!['total', 'date'].includes(key) && !!timeslot[key]) {
          timeSlotRangeTime = key.split('_');
          fromTime = formatedDate + ' ' + timeSlotRangeTime[0] + '.000Z';
          toTime = formatedDate + ' ' + timeSlotRangeTime[1] + '.000Z';
          promotionFlashSale.push({
            fromTime,
            toTime,
            promotion: promotionId ? new Promotion(promotionId) : null,
            id: null
          })
        }
      });
    });

    return promotionFlashSale;
  }
}
