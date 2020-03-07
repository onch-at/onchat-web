import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuddyPage } from './buddy.page';

describe('BuddyPage', () => {
  let component: BuddyPage;
  let fixture: ComponentFixture<BuddyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuddyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuddyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
