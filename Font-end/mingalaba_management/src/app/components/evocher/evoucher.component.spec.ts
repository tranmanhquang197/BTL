import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvoucherComponent } from './evoucher.component';


describe('', () => {
  let component: EvoucherComponent;
  let fixture: ComponentFixture<EvoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
