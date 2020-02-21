import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FriendPage } from './friend.page';

describe('FriendPage', () => {
  let component: FriendPage;
  let fixture: ComponentFixture<FriendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
