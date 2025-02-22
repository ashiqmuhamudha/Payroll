import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxinfolistComponent } from './taxinfolist.component';

describe('TaxinfolistComponent', () => {
  let component: TaxinfolistComponent;
  let fixture: ComponentFixture<TaxinfolistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxinfolistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxinfolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
