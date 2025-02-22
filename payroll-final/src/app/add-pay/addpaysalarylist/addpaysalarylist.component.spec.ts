import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpaysalarylistComponent } from './addpaysalarylist.component';

describe('AddpaysalarylistComponent', () => {
  let component: AddpaysalarylistComponent;
  let fixture: ComponentFixture<AddpaysalarylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpaysalarylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpaysalarylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
