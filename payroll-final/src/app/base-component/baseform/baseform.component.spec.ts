import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseformComponent } from './baseform.component';

describe('BaseformComponent', () => {
  let component: BaseformComponent;
  let fixture: ComponentFixture<BaseformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
