import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPatternComponent } from './search-pattern.component';

describe('SearchPatternComponent', () => {
  let component: SearchPatternComponent;
  let fixture: ComponentFixture<SearchPatternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPatternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
