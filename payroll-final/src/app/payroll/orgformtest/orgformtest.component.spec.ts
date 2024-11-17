import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgformtestComponent } from './orgformtest.component';

describe('OrgformtestComponent', () => {
  let component: OrgformtestComponent;
  let fixture: ComponentFixture<OrgformtestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgformtestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgformtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
