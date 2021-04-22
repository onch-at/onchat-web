import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TipsComponent } from './tips.component';

describe('TipsComponent', () => {
  let component: TipsComponent;
  let fixture: ComponentFixture<TipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
