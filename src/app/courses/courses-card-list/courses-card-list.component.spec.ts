import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesCardListComponent } from './courses-card-list.component';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { setupCourses } from '../common/setup-test-data';


describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;

  // A fixture is a wrapper for a component and its template.
  let fixture: ComponentFixture<CoursesCardListComponent>;

  // Utility required to query elements in the DOM
  let el: DebugElement;

  beforeEach( waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CoursesModule
      ]
    }).compileComponents()
      .then(() => {
        // This is a synchronous operation since compiling the component might take a while
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    //check that the component is initialized correctly
    expect(component).toBeTruthy();
    console.log(component);

  });


  it("should display the course list", () => {

    // Get some data for the component
    component.courses = setupCourses();

    // Update the component since data has changed
    fixture.detectChanges();

    // Print out the current state of the DOM
    console.log(el.nativeElement.outerHTML);

    // To query the DOM, we need to parse in a predicate
    // Which returns trus / false if the element matches the predicate
    const cards = el.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");
  });


  it("should display the first course", () => {

    // Get some data for the component, and trigger changes to DOM
    component.courses = setupCourses();
    fixture.detectChanges();

    const course = component.courses[0];
    const card = el.query(By.css(".course-card:first-child")),
      title = card.query(By.css("mat-card-title")),
      image = card.query(By.css("img"));

    expect(card).toBeTruthy("Could not find the first course card");
    expect(title.nativeElement.textContent).toBe(course.titles.description, "Unexpected course title");
    expect(image.nativeElement.src).toBe(course.iconUrl, "Unexpected course image");
  });


});


