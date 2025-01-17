import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ERROR_MESSAGE_TIMEOUT, REQUEST_DEBOUNCE } from '../shared/constants';
import { UploadComponent } from './upload.component';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error for a non-image file', () => {
    const input = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement;
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } } as unknown as Event;

    input.dispatchEvent(new Event('change'));
    component.onFileSelected(event);
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Please select an image file');
  });

  it('should show an error for a file larger than 10MB', () => {
    const input = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement;
    const file = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } } as unknown as Event;

    input.dispatchEvent(new Event('change'));
    component.onFileSelected(event);
    fixture.detectChanges();

    expect(component.errorMessage).toBe('File too large. Max size: 10MB.');
  });

  it('should reset error message after timeout', fakeAsync(() => {
    component.errorMessage = 'Error occurred';
    component.resetErrorMessage();
    tick(5000);
    fixture.detectChanges();

    expect(component.errorMessage).toBeNull();
  }));

  it('should show an error if no file is selected for upload', fakeAsync(() => {
    component.selectedFile = null;
    component.uploadImage();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Select an image file to upload.');
    tick(ERROR_MESSAGE_TIMEOUT);
    fixture.detectChanges();

    expect(component.errorMessage).toBeNull();
  }));

  it('should successfully upload an image file', fakeAsync(async () => {
    const file = new File(['test'], 'image.jpg', { type: 'image/jpeg' });
    component.selectedFile = file;
  
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response(null, { status: 200 })));
  
    await component.uploadImage();
    tick(REQUEST_DEBOUNCE); 
    fixture.detectChanges();
  
    expect(component.errorMessage).toBeNull();
    expect(component.isLoading).toBeFalse(); 
  }));
});
