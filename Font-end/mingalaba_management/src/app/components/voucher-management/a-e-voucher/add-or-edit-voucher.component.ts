import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {KpiAuthoritiesUtils} from '../../../_utils/kpi/kpi.authorities.utils';
import {voucherStatusAction} from '../../../_models/enums/voucher.status.enum';
import {VoucherService} from '../shared/voucher.service';
import {Voucher} from '../../../_models/voucher/voucher.model';
import {Apollo, gql} from 'apollo-angular';
import {
    AuthoritiesResolverService,
    FlatTreeConfigConvertObject,
    FlatTreeNode
} from '@next-solutions/next-solutions-base';
import {
    ApiService,
    AuthoritiesService,
    BaseAddEditLayout, BaseSearchLayout,
    FileTypes,
    SelectModel,
    UtilsService,
} from '@next-solutions/next-solutions-base';
import {environment} from '../../../../environments/environment';
import {CreateFileInput} from '../../../_models/voucher/file.input.model';
import {VoucherInput} from '../../../_models/voucher/voucher.input.model';
import {ThemePalette} from '@angular/material/core';
import {Observable, Observer, Subject} from 'rxjs';
import {debounceTime, delay, filter, map, startWith, takeUntil, tap} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Hobby} from '../../../_models/voucher/hobby.model';
import {MangoHitBaseSearch} from '../../../base/mango-hit-base-search';
import {CommonUtils} from '../../../_utils/common/common.utils';
import { NzUploadFile } from 'ng-zorro-antd/upload';

// @ts-ignore
import { NzMessageService, UploadFile ,UploadXHRArgs} from 'ng-zorro-antd';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'

import {
    HttpRequest,
    HttpClient,
    HttpEventType,
    HttpEvent,
    HttpResponse,
    HttpHeaders,
    HttpParams
} from '@angular/common/http';

enum Role {
    SALESMAN_EVOUCHER = 'SALESMAN_EVOUCHER',
    CHAT_BUSINESS_USER = 'CHAT_BUSINESS_USER'
}


const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

// @ts-ignore
@Component({
    selector: 'app-voucher-detail',
    templateUrl: './add-or-edit-voucher.component.html',
    styleUrls: ['./add-or-edit-voucher.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class AddOrEditVoucherComponent extends BaseAddEditLayout implements OnInit {
    moduleName = 'voucher.add.edit.';
    typeOptions: SelectModel[] = [];
    statusOptions: SelectModel[] = [];

    filesData: any = null;


    fileList: NzUploadFile[] = [
    ];
    previewImage: string | undefined = '';
    previewVisible = false;

    files = [];
    vouchers?:any;


    constructor(protected activatedRoute: ActivatedRoute,
                protected formBuilder: FormBuilder,
                protected location: Location,
                protected translateService: TranslateService,
                protected apiService: ApiService,
                protected utilsService: UtilsService,
                protected authoritiesService: AuthoritiesService,
                private router: Router,
                public dialog: MatDialog,
                public kpiAuthoritiesUtils: KpiAuthoritiesUtils,
                public apollo: Apollo,
                public voucherService: VoucherService,
                public http: HttpClient,
    ) {

        super(activatedRoute, location, translateService, utilsService, authoritiesService);


    }

    ngOnInit(): void {


        super.ngOnInit();

        this.apiService.get('/api/user/getProductTypeAll',
            new HttpParams(), environment.SERVER_BOOK)
            .subscribe((res:any) => {
                this.typeOptions = [];
                res.data.forEach((item:any)=>{
                    this.typeOptions.push(new SelectModel(item.id,item.name));
                })
            });


        this.addEditForm = this.formBuilder.group({
            name: [''],
            productType: [''],
            quantity: [''],
            price: [''],
        });

        if(this.isEdit){
            const formData = new FormData();
            formData.append('id',this.id);
            this.apiService.post('/api/user/getProductId', formData,
                {
                    headers: new HttpHeaders(),
                }, environment.SERVER_BOOK).subscribe((res:any) => {
                this.vouchers = res.data;

                res.data.attachMents.forEach((item:any,index:any)=>{
                    this.fileList = [...this.fileList,{
                        uid: index+1,
                        name: index+'image.png',
                        status: 'done',
                        url: item.url
                    }]
                })

                this.addEditForm.patchValue({
                    name: this.vouchers.name,
                    productType: this.vouchers.productTypes,
                    quantity: this.vouchers.count,
                    price: this.vouchers.price,
                })

            });
        }

    }




    onSave() {
        const { name ,quantity,productType,price} = this.addEditForm.value;
        const formData = new FormData();
        if (!this.isEdit) {
            if(this.files.length){
                // tslint:disable-next-line:prefer-for-of
                for(let i=0 ; i < this.files.length ; i++)
                { // @ts-ignore
                    formData.append('images', this.files[i],this.files[i].name);
                }
            }


            formData.append('image', this.filesData);
            formData.append('name', name);
            formData.append('productType', productType);
            formData.append('quantity', quantity);
            formData.append('price', price);
            formData.append('name', name);
            formData.append('id', '');

            this.apiService.post('/api/user/createProduct', formData,
                {
                    headers: new HttpHeaders(),
                }, environment.SERVER_BOOK)
                .subscribe(res => {
                    this.utilsService.onSuccessFunc('Tạo thành công sản phẩm ');
                    this.router.navigate(['/voucher']).then();
                });
        } else {
            if(this.files.length){
                // tslint:disable-next-line:prefer-for-of
                for(let i=0 ; i < this.files.length ; i++)
                { // @ts-ignore
                    formData.append('images', this.files[i],this.files[i].name);
                }
            }


            formData.append('image', this.filesData);
            formData.append('name', name);
            formData.append('productType', productType);
            formData.append('quantity', quantity);
            formData.append('price', price);
            formData.append('name', name);
            formData.append('id', this.id);

            this.apiService.post('/api/user/createProduct', formData,
                {
                    headers: new HttpHeaders(),
                }, environment.SERVER_BOOK)
                .subscribe(res => {
                    this.utilsService.onSuccessFunc('Update thành công sản phẩm ');
                    this.router.navigate(['/voucher']).then();
                });


        }
    }



    onFileChange(event: any) {
        const files = event.target.files;
        this.handleFile(files, '');
    }

    private handleFile(files: FileList | null, type: string) {
        if (files && files.length) {
            const file = files[0];
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                const reader = new FileReader();
                console.log(file);
                this.filesData = file;
                reader.onloadend = (e) => {
                    const target: any = e.target;
                    const result = target.result;
                };
                reader.readAsDataURL(file);
            } else {
                alert(`Only accept file type png, jpg`);
            }
        }
    }


    setMediaUploadHeaders = (file: UploadFile) => {
        return {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
        }
    };
    customUploadReq = (item: UploadXHRArgs) => {
        const formData = new FormData();
        formData.append('file', item.file as any); // tslint:disable-next-line:no-any

        /// formData.append('id', '1000');
        const req = new HttpRequest('POST', item.action, formData, {
            reportProgress : true,
            withCredentials: false
        });



        // @ts-ignore
        this.files.push(item.file);
        const formData1 = new FormData();
        // @ts-ignore



        // Always return a `Subscription` object, nz-upload will automatically unsubscribe at the appropriate time
        // @ts-ignore
        return this.http.request(req).subscribe((event: HttpEvent<{}>) => {
            if (event.type === HttpEventType.UploadProgress) {
                // @ts-ignore
                if (event.total > 0) {
                    // @ts-ignore
                    (event as any).percent = event.loaded / event.total * 100; // tslint:disable-next-line:no-any
                }
                // To process the upload progress bar, you must specify the `percent` attribute to indicate progress.
                item.onProgress(event, item.file);
            } else if (event instanceof HttpResponse) { /* success */
                item.onSuccess(event.body, item.file, event);
            }
        },(err) => { /* error */
            item.onError(err, item.file);
        });
    }

}

