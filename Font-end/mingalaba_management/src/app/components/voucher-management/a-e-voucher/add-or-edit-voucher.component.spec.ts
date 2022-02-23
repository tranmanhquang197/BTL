import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditVoucherComponent } from './add-or-edit-voucher.component';

describe('VoucherDetailComponent', () => {
  let component: AddOrEditVoucherComponent;
  let fixture: ComponentFixture<AddOrEditVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrEditVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
