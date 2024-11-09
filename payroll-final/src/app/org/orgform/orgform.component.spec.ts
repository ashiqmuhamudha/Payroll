import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgformComponent } from './orgform.component';

describe('OrgformComponent', () => {
  let component: OrgformComponent;
  let fixture: ComponentFixture<OrgformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
