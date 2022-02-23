import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {KpiAuthoritiesUtils} from '../../../_utils/kpi/kpi.authorities.utils';
import {voucherStatusAction} from '../../../_models/enums/voucher.status.enum';
import {Voucher} from '../../../_models/voucher/voucher.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Apollo, gql} from 'apollo-angular';
import {
    ApiService,
    AuthoritiesService,
    BaseAddEditLayout,
    FileTypes, FlatTreeConfigConvertObject, FlatTreeNode,
    SelectModel,
    UtilsService,
} from '@next-solutions/next-solutions-base';
import {environment} from '../../../../environments/environment';
import {CreateFileInput} from '../../../_models/voucher/file.input.model';
import {VoucherInput} from '../../../_models/voucher/voucher.input.model';
import {ThemePalette} from '@angular/material/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, delay, filter, map, startWith, takeUntil, tap} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Hobby} from '../../../_models/voucher/hobby.model';
import {VoucherService} from '../voucher.service';
import {PromotionTownship} from '../../../_models/promotion/applyfor/promotion.township.model';
import {CommonUtils} from "../../../_utils/common/common.utils";


enum Role {
    SALESMAN_EVOUCHER = 'SALESMAN_EVOUCHER',
    CHAT_BUSINESS_USER = 'CHAT_BUSINESS_USER'
}

@Component({
    selector: 'app-add-edit-evoucher-detail',
    templateUrl: './add-edit-evoucher.component.html',
    styleUrls: ['./add-edit-evoucher.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class AddEditEvoucherComponent extends BaseAddEditLayout implements OnInit {
    moduleName = 'evoucher.add.edit.';
    statusOptions: SelectModel[] = [];
    filesData: any = null;


    voucher: Voucher | undefined;




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
                public http: HttpClient
    ) {

        super(activatedRoute, location, translateService, utilsService, authoritiesService);


    }

    ngOnInit(): void {
        super.ngOnInit();


        this.addEditForm = this.formBuilder.group({
            image: [''],
            name: [''],
            description: [''],
        }, );




        if (this.isEdit) {
            const formData = new FormData();
            formData.append('id', this.id);
            this.apiService.post('/api/user/getProductTypeId', formData,
                {
                    headers: new HttpHeaders(),
                }, environment.SERVER_BOOK).subscribe((res:any) => {
                    const data = res.data;
                    this.addEditForm.get('name')?.patchValue(data.name);
                    this.addEditForm.patchValue({
                        image: CommonUtils.file2Url(data.image, FileTypes.PNG),
                    });
            });
        }


    }



    addOrEdit(voucher: Voucher | undefined) {
        if (voucher) {
            this.router.navigate(['/voucher/edit/' + voucher.id]).then();
        } else {
            this.router.navigate(['/voucher/add']).then();
        }
    }

    onSave() {
        if (!this.isEdit) {
            const { name } = this.addEditForm.value;
            const formData = new FormData();
            formData.append('image', this.filesData);
            formData.append('name', name);
            formData.append('id', '');

            this.apiService.post('/api/user/createProductType', formData,
                {
                    headers: new HttpHeaders(),
                }, environment.SERVER_BOOK).subscribe(res => {
                    this.router.navigate(['/evoucher']).then();
                });


        } else {
            const { name } = this.addEditForm.value;
            const formData = new FormData();
            formData.append('image', this.filesData);
            formData.append('name', name);
            formData.append('id', this.id);

            this.apiService.post('/api/user/createProductType', formData,
                {
                    headers: new HttpHeaders(),
                }, environment.SERVER_BOOK).subscribe(res => {
                this.router.navigate(['/evoucher']).then();
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




    get FileTypes() {
        return FileTypes;
    }



}

