import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaformComponent } from './formulaform.component';

describe('FormulaformComponent', () => {
  let component: FormulaformComponent;
  let fixture: ComponentFixture<FormulaformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
