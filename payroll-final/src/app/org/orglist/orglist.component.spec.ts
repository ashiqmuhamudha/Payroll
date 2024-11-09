import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrglistComponent } from './orglist.component';

describe('OrglistComponent', () => {
  let component: OrglistComponent;
  let fixture: ComponentFixture<OrglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrglistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
