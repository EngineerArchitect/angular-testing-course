import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';
import { HomeComponent } from './home.component';
import { CoursesService } from '../services/courses.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(course => course.category == 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category == 'ADVANCED');

  beforeEach(waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule  // To ensure no animations are run
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement
        coursesService = TestBed.inject(CoursesService);
      })

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {

    // Note RxJs "of" creates an observerable from a set of values
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    // console.log(el.nativeElement.outerHTML);

    const tabs = el.queryAll(By.css('.mat-mdc-tab'));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");

  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-mdc-tab'));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");

  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-mdc-tab'));

    expect(tabs.length).toBe(2, "Unexpected number of tabs found");
  });

  const ButtonClickEvents = {
    left: { button: 0 },
    right: { button: 2 }
  };

  function createClickEvent(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
    if (el instanceof HTMLElement) {
      el.click();
    } else {
      el.triggerEventHandler('click', eventObj);
    }
  }

  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {

    //Get Data
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    // Reflect changes to DOM
    fixture.detectChanges();

    // Get tabs component
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));

    // Simulate a click on 2nd Tab, with left mouse button

    createClickEvent(tabs[1]);
    fixture.detectChanges();

    flush();

    // const cardTitles = el.queryAll(By.css('.mat-mdc-card-title'));
    const cardTitles = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
  }));

  it("should display advanced courses when tab clicked - async", waitForAsync(() => {

    //Get Data
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    // Reflect changes to DOM
    fixture.detectChanges();

    // Get tabs component
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));

    // Simulate a click on 2nd Tab, with left mouse button
    createClickEvent(tabs[1]);
    fixture.detectChanges();

    // whenStable creates a Promise, when all asyncronous calls are completed
    fixture.whenStable().then(() => {
      const cardTitles = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'));
      expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
      expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
    });

  }));

});


