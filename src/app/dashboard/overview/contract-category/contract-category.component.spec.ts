import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCategoryComponent } from './contract-category.component';

describe('ContractCategoryComponent', () => {
  let component: ContractCategoryComponent;
  let fixture: ComponentFixture<ContractCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
