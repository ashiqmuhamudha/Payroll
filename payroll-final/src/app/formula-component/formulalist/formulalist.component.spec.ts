import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulalistComponent } from './formulalist.component';

describe('FormulalistComponent', () => {
  let component: FormulalistComponent;
  let fixture: ComponentFixture<FormulalistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulalistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulalistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
