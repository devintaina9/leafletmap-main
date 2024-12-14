import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Maps2Page } from './maps2.page';

describe('Maps2Page', () => {
  let component: Maps2Page;
  let fixture: ComponentFixture<Maps2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Maps2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
