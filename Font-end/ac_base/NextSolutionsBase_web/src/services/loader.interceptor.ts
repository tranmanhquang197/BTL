import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {LoaderService} from './loader.service';
import { catchError, finalize, map } from 'rxjs/operators';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  private requests: HttpRequest<any>[] = [];

  constructor(public loaderService: LoaderService) {
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.headers.get('is_image')){
      this.requests.push(request);
      // console.log('LoaderInterceptor: wait for ' + this.requests.length + 'requests');
      this.loaderService.isLoading.next(true);
    } else {
      request = request.clone({
        headers: request.headers.delete('is_image')
      });
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        // console.log(event, (event instanceof HttpResponse));
        if (event instanceof HttpResponse) {
          this.removeRequest(request);
        }
        return event;
      }),
      catchError(err => {
        console.error('Error: ', err);
        this.removeRequest(request);
        return throwError(err);
      }),
      finalize(() => {
        // console.log('OMG!!!');
        this.removeRequest(request);
      }),
    );
  }
}
