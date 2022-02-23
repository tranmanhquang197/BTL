import { TranslateLoader } from '@ngx-translate/core';
import { from, merge, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const appAvailableLanguages: string[] = environment.LANGS.map(l => l.code);

export class TranslateLoaderFactoryHelper {
  static forModule(module?: string): any {
    return class LazyTranslateLoader implements TranslateLoader {
      getTranslation(lang: string): Observable<any> {
        if (!appAvailableLanguages.includes(lang)) {
          lang = environment.DEFAULT_LANGUAGE;
        }
        if (!module) {
          return from(import(`../../assets/i18n/${lang}.json`));
        }
        return merge(
          from(import(`../../assets/i18n/${lang}.json`)),
          from(import(`../../assets/i18n/${module}/${lang}.json`)),
        );
      }
    };
  }
}
