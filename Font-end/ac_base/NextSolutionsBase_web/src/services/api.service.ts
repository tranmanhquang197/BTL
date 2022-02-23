import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {FileSaverService} from 'ngx-filesaver';
import {InjectTokenNextSolutionsConfig, NextSolutionsConfig} from '../modules/next.solutions.config';
import {Observable} from 'rxjs';

@Injectable()
export class ApiService {

    config: NextSolutionsConfig;

    constructor(private http: HttpClient, private fileSaver: FileSaverService, private injector: Injector) {
        this.config = injector.get(InjectTokenNextSolutionsConfig);
    }

    getFullUrl(url: string) {
        return this.config.BASE_URL + url;
    }

    get<T>(nativeUrl: string, params: HttpParams, baseUrl?: string): Observable<T> {
        return this.http.get<T>(baseUrl ? (baseUrl + nativeUrl) : this.getFullUrl(nativeUrl), {params});
    }

    getJSON<T>(file: string): Observable<T> {
        return this.http.get<T>(file);
    }

    post(nativeUrl: string, obj: any, options?: { headers?: HttpHeaders, params?: HttpParams }, baseUrl?: string) {
        return this.http.post(baseUrl ? (baseUrl + nativeUrl) : this.getFullUrl(nativeUrl), obj, options ? {
            headers: options.headers,
            params: options.params,
        } : {});
    }

    postBlob(nativeUrl: string, obj: any, options: { headers?: HttpHeaders; params?: HttpParams }, baseUrl?: string) {
        return this.http.post(baseUrl ? (baseUrl + nativeUrl) : this.getFullUrl(nativeUrl), obj, {
            headers: options.headers,
            params: options.params,
            observe: 'response',
            responseType: 'blob',
        });
    }

    patch(nativeUrl: string, obj: any, options?: { headers?: HttpHeaders, params?: HttpParams }, baseUrl?: string) {
        return this.http.patch(baseUrl ? (baseUrl + nativeUrl) : this.getFullUrl(nativeUrl), obj,
            options ? {headers: options.headers, params: options.params} : {});
    }

    put(nativeUrl: string, obj: any, options?: { headers?: HttpHeaders, params?: HttpParams }, baseUrl?: string) {
        return this.http.put(baseUrl ? (baseUrl + nativeUrl) : this.getFullUrl(nativeUrl), obj,
            options ? {headers: options.headers, params: options.params} : {});
    }

    delete(nativeUrl: string, options?: { headers?: HttpHeaders, params?: HttpParams }, baseUrl?: string) {
        return this.http.delete(baseUrl ? (baseUrl + nativeUrl) : this.getFullUrl(nativeUrl), options ? {
            headers: options.headers,
            params: options.params
        } : {});
    }

    saveFile(nativeUrl: string, obj: any, options: { headers?: HttpHeaders; params?: HttpParams }, baseUrl?: string, onErrorFunc?: (err: any) => void) {
        this.http.post(baseUrl ? (baseUrl + nativeUrl) : this.getFullUrl(nativeUrl), obj, {
            headers: options.headers,
            params: options.params,
            observe: 'response',
            responseType: 'blob',
        }).subscribe((l: HttpResponse<Blob>) => {
            let filename = '';
            const disposition = l.headers.get('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }
            const blobData: Blob | null = l.body;
            const contentType: string | null = l.headers.get('Content-Type');
            if (blobData && contentType) {
                this.fileSaver.save(blobData, filename, contentType);
            }
        }, (err) => {
            if (onErrorFunc){
                onErrorFunc(err);
            }
        });
    }


}
