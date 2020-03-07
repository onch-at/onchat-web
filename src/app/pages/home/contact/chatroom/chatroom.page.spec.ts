import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatroomPage } from './chatroom.page';

describe('ChatroomPage', () => {
  let component: ChatroomPage;
  let fixture: ComponentFixture<ChatroomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatroomPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatroomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
