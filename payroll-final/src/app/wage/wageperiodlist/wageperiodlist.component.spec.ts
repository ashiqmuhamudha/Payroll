import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WageperiodlistComponent } from './wageperiodlist.component';

describe('WageperiodlistComponent', () => {
  let component: WageperiodlistComponent;
  let fixture: ComponentFixture<WageperiodlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WageperiodlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WageperiodlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
