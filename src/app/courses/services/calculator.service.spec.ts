import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

// Define Test Suite
describe('CalculatorService', () => {

    let calculator: CalculatorService,
        loggerSpy: any;  // Since it's being mocked

    // This block will be executed before each specification
    // Ideal place for initialization logic
    beforeEach(() => {
        console.log("Before Each setup");
        loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);

        calculator = new CalculatorService(loggerSpy);
    });

    it('should add two numbers', () => {
        console.log("Add Test");

        const result = calculator.add(3, 2);

        expect(result).toBe(5);
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);

    });

    it('should subtract two numbers', () => {
        console.log("Subtract Test");
        const result = calculator.subtract(5, 2);

        expect(result).toBe(3, "unexpected subtraction result");
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });
});