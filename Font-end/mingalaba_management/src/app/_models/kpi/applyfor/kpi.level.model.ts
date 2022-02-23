import {Kpi} from '../kpi.model';
import {Level} from '../../level/level.model';

export class KpiLevel {
  id?: number | undefined | null;
  kpi: Kpi | undefined | null;
  level: Level | undefined | null;

  constructor(kpiLevel: KpiLevel) {
    this.id = kpiLevel.id;
    this.kpi = kpiLevel.kpi;
    this.level = kpiLevel.level;
  }
}
