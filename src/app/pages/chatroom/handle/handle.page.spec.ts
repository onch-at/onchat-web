import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HandlePage } from './handle.page';

describe('HandlePage', () => {
  let component: HandlePage;
  let fixture: ComponentFixture<HandlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandlePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HandlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
