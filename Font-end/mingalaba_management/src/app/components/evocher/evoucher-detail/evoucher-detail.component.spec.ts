import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvoucherDetailComponent } from './evoucher-detail.component';


describe('EvoucherDetailComponent', () => {
  let component: EvoucherDetailComponent;
  let fixture: ComponentFixture<EvoucherDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvoucherDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvoucherDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
