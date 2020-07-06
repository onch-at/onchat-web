import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NewComponent } from './new.component';

describe('AddComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
