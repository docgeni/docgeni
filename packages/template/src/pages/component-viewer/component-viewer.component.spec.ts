import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentViewerComponent } from './component-viewer.component';

describe('ComponentViewerComponent', () => {
  let component: ComponentViewerComponent;
  let fixture: ComponentFixture<ComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
