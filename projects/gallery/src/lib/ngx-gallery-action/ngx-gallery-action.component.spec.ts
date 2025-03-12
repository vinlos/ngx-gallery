import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGalleryActionComponent } from './ngx-gallery-action.component';

describe('NgxGalleryActionComponent', () => {
  let component: NgxGalleryActionComponent;
  let fixture: ComponentFixture<NgxGalleryActionComponent>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
    imports: [NgxGalleryActionComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGalleryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
