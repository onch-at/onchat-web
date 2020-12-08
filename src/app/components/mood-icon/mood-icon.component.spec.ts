import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MoodIconComponent } from './mood-icon.component';

describe('MoodIconComponent', () => {
  let component: MoodIconComponent;
  let fixture: ComponentFixture<MoodIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoodIconComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MoodIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
