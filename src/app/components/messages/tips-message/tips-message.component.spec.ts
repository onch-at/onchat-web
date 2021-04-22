import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TipsMessageComponent } from './tips-message.component';


describe('TipsMessageComponent', () => {
  let component: TipsMessageComponent;
  let fixture: ComponentFixture<TipsMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TipsMessageComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TipsMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
