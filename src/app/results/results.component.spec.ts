import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ResultsComponent } from './results.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a loading spinner initially', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.animate-spin'));
    expect(spinner).toBeTruthy();
  });

  it('should reset error message after timeout', fakeAsync(() => {
    component.errorMessage = 'Error occurred';
    component['resetErrorMessage']();
    tick(5000);
    fixture.detectChanges();

    expect(component.errorMessage).toBeNull();
  }));

  it('should navigate to the next page when possible', fakeAsync(async () => {
    component.totalPages = 3;
    component.currentPage = 1;
    spyOn(component, 'loadImages');

    component.nextPage();
    tick();
    expect(component.currentPage).toBe(2);
    expect(component.loadImages).toHaveBeenCalled();
  }));

  it('should not navigate to the next page if already on the last page', () => {
    component.totalPages = 2;
    component.currentPage = 2;
    spyOn(component, 'loadImages');

    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.loadImages).not.toHaveBeenCalled();
  });

  it('should navigate to the previous page when possible', fakeAsync(async () => {
    component.currentPage = 2;
    spyOn(component, 'loadImages');

    component.previousPage();
    tick();
    expect(component.currentPage).toBe(1);
    expect(component.loadImages).toHaveBeenCalled();
  }));

  it('should not navigate to the previous page if already on the first page', () => {
    component.currentPage = 1;
    spyOn(component, 'loadImages');

    component.previousPage();
    expect(component.currentPage).toBe(1);
    expect(component.loadImages).not.toHaveBeenCalled();
  });

  it('should update results with new images', () => {
    const newImages = [{ url: 'new-image.jpg' }];
    component.updateResults(newImages);

    expect(component.results).toEqual(newImages);
  });
});
