import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MsgListComponent } from './msg-list.component';

describe('MsgListComponent', () => {
  let component: MsgListComponent;
  let fixture: ComponentFixture<MsgListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MsgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
