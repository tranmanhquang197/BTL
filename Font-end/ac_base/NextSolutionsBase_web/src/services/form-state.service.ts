import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FormStateService {
  private subject = new BehaviorSubject<Map<string, FormGroup>>(new Map<string, FormGroup>());
  uiState$ = this.subject.asObservable();

  setMapState(mapState: Map<string, FormGroup>) {
    this.subject.next(mapState);
  }
}
