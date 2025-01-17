import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { ERROR_MESSAGE_TIMEOUT } from '../shared/constants';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle blur and reset placeholder text', () => {
    component.query = 'some text';
    component.onBlur();

    expect(component.placeholderText).toBe('some text');

    component.query = '';
    component.onBlur();

    expect(component.placeholderText).toBe(component.defaultPlaceholder);
  });

  it('should show an error for empty query', () => {
    component.query = '';
    component.onSearch();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Search query cannot be empty.');
  });

  it('should reset error message after timeout', fakeAsync(() => {
    component.errorMessage = 'Search query cannot be empty.';
    component.resetErrorMessage();
    tick(ERROR_MESSAGE_TIMEOUT);
    fixture.detectChanges();

    expect(component.errorMessage).toBeNull();
  }));

  it('should clear error message on focus', () => {
    component.errorMessage = 'Some error';
    component.onFocus();

    expect(component.errorMessage).toBeNull();
    expect(component.placeholderText).toBe('');
  });
});
