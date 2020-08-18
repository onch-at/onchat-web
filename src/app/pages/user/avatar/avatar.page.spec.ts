import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvatarPage } from './avatar.page';

describe('AvatarPage', () => {
  let component: AvatarPage;
  let fixture: ComponentFixture<AvatarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
