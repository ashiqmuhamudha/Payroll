import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpaysalaryformComponent } from './addpaysalaryform.component';

describe('AddpaysalaryformComponent', () => {
  let component: AddpaysalaryformComponent;
  let fixture: ComponentFixture<AddpaysalaryformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpaysalaryformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpaysalaryformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
