import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as QuillNamespace from 'quill';
import ImageResize from 'quill-image-resize-module';

const Quill: any = QuillNamespace;
Quill.register('modules/imageResize', ImageResize);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


function _window(): any {
  return window;
}


_window().Quill = Quill;
_window().quill = Quill;
