import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { provideHttpClient } from "@angular/common/http";
import { Course } from "../model/course";

describe("CoursesService", () => {
    let coursesService: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CoursesService,
                provideHttpClient(),       // Provides HttpClient
                provideHttpClientTesting() // New recommended approach
            ]
        });

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should retrieve all courses', () => {
        coursesService.findAllCourses()
            .subscribe(courses => {
                expect(courses).toBeTruthy("No courses returned");
                expect(courses.length).toBe(12, "Incorrect number of courses");
                const course = courses.find(course => course.id == 12);
                expect(course?.titles.description).toBe("Angular Testing Course");
            });

        // Mock HTTP Request
        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual('GET');
        req.flush({ payload: Object.values(COURSES) });
    });

    it('should find a course by id', () => {
        // Perform retrival and test
        coursesService.findCourseById(12)
            .subscribe(course => {
                expect(course).toBeTruthy("No course returned");
                expect(course.id).toBe(12, "Incorrect course id");
            });

        // Mock HTTP Request
        const req = httpTestingController
            .expectOne('/api/courses/12');
        expect(req.request.method).toEqual('GET');
        req.flush(COURSES[12]);
    });

    it('should save the course data', () => {
        const changes: Partial<Course> = { titles: { description: 'Testing Course' } };

        // Perform save and test
        coursesService.saveCourse(12, changes)
            .subscribe(course => {
                expect(course.id).toBe(12, "Incorrect course id");
            });

        // Expect the correct API call (and validate the request sent to server)
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.titles.description).toEqual(changes.titles.description);


        req.flush({
            ...COURSES[12], // Spread operator to copy object to reply
            ...changes      // Spread operator to copy changes to reply
        });
    });

    it(('should give an error if save course fails'), () => {
        const changes: Partial<Course> = { titles: { description: 'Testing Course' } };

        // Perform save and test
        coursesService.saveCourse(12, changes)
            .subscribe(
                () => {
                    fail("the save course operation should have failed")
                },
                error => {
                    expect(error.status).toBe(500, "Incorrect status code");
                });

        // Expect the correct API call (and validate the request sent to server)
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');

        // Respond with an error
        req.flush('Save course failed', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should find a list of lessons', () => {
        coursesService.findLessons(12)
            .subscribe(lessons => {
                expect(lessons).toBeTruthy("No lessons returned");
                expect(lessons.length).toBe(3, "Incorrect number of lessons");
            });

        // Mock HTTP Request
        const req = httpTestingController.expectOne(req => req.url == '/api/lessons');

        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('courseId')).toEqual('12');
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');

        req.flush({ 
            payload: findLessonsForCourse(12).slice(0, 3)
        });
    });


    afterEach(() => {
        // Ensure that no extra calls are being made
       httpTestingController.verify();
    });
});