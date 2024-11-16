import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WageperiodformComponent } from './wageperiodform.component';

describe('WageperiodformComponent', () => {
  let component: WageperiodformComponent;
  let fixture: ComponentFixture<WageperiodformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WageperiodformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WageperiodformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
