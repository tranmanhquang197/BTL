import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JsogService } from 'jsog-typescript';
import { SuperEntity } from '../models/SuperEntity';
import { map } from 'rxjs/operators';

@Injectable()
export class JsogHttpInterceptor implements HttpInterceptor {

  constructor(private jSog: JsogService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.body && !(request.body instanceof FormData)) {
      request = request.clone({ body: this.jSog.serialize(request.body) });
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        // console.log(Object.getPrototypeOf(event));
        if (!(event instanceof HttpResponse || HttpResponseBase.prototype.isPrototypeOf(event))) {
          // console.log('event instanceof HttpResponse', event instanceof HttpResponse, HttpResponseBase.prototype.isPrototypeOf(event), event);
          return event;
        }
        let response = event as HttpResponse<any>;
        if (!response.body || typeof(response.body) !== 'object' || (response.body instanceof Blob)) {
          // console.log('typeof(event.body !== \'object\')', typeof(response.body) !== 'object',
          //   'event.body instanceof Blob', response.body instanceof Blob, response.body);
          return response;
        }
        response = response.clone({ body: this.jSog.deserializeArray(response.body, SuperEntity) });
        return response;
      }),
    );
  }
}
