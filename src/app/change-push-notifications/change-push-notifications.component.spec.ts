import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePushNotificationsComponent } from './change-push-notifications.component';

describe('ChangePushNotificationsComponent', () => {
  let component: ChangePushNotificationsComponent;
  let fixture: ComponentFixture<ChangePushNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePushNotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePushNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
