import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class SingletonTranslateService {
  currentLanguage = new BehaviorSubject<string>('');
  currentLanguage$ = this.currentLanguage.asObservable();
}
