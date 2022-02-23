import {Pipe, PipeTransform} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Pipe({
    name: 'secure'
})
export class SecureImgPipe implements PipeTransform {

    constructor(private http: HttpClient,
                private sanitizer: DomSanitizer) {
    }

    transform(url: string): Observable<SafeUrl> {
        return this.http
            .get(url, {
                headers: new HttpHeaders().set('is_image', 'true'),
                responseType: 'blob'
            })
            .pipe(
                map(value => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value)))
            )
    }

}
