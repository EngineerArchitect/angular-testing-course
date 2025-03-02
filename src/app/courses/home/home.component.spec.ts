import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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

  beforeEach(waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule, 
        NoopAnimationsModule  // To ensure no animations are run
      ],
      providers: [
        { provide: CoursesService,useValue: coursesServiceSpy }
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

});


