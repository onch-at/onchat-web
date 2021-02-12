import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailBinderComponent } from './email-binder.component';

describe('EmailBinderComponent', () => {
  let component: EmailBinderComponent;
  let fixture: ComponentFixture<EmailBinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailBinderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailBinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
