import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxinfoformComponent } from './taxinfoform.component';

describe('TaxinfoformComponent', () => {
  let component: TaxinfoformComponent;
  let fixture: ComponentFixture<TaxinfoformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxinfoformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxinfoformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
