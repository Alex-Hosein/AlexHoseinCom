import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinerComponent } from './miner.component';

describe('MinerComponent', () => {
  let component: MinerComponent;
  let fixture: ComponentFixture<MinerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinerComponent]
    });
    fixture = TestBed.createComponent(MinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
