import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxBlocklyComponent } from './ngx-blockly.component';

describe('NgxBlocklyComponent', () => {
  let component: NgxBlocklyComponent;
  let fixture: ComponentFixture<NgxBlocklyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxBlocklyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxBlocklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
