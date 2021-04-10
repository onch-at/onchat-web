import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestPage } from './request.page';

describe('RequestPage', () => {
  let component: RequestPage;
  let fixture: ComponentFixture<RequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
