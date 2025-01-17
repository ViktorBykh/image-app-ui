import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { debounce } from 'lodash';
import { environment } from '../../environments/environment';
import { ERROR_MESSAGE_TIMEOUT, MAX_FILE_SIZE, REQUEST_DEBOUNCE } from '../shared/constants';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  @Output() uploadSuccessful: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  resetErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = null;
    }, ERROR_MESSAGE_TIMEOUT);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.errorMessage = 'Please select an image file';
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
      } else {
        this.selectedFile = file.size <= MAX_FILE_SIZE ? file : null;
        this.errorMessage = this.selectedFile ? null : 'File too large. Max size: 10MB.';
      }
      this.resetErrorMessage();
    }
  }

  async uploadImage(): Promise<void> {
    if (!this.selectedFile) {
      this.errorMessage = 'Select an image file to upload.';
      this.resetErrorMessage();
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    await this.handleUploadRequest(this.selectedFile);
  }

  private handleUploadRequest = debounce(async (selectedFile: File) => {
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      const response = await fetch(`${environment.BASE_URL}/upload`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed. Try again.');
      this.selectedFile = null;
      this.fileInput.nativeElement.value = '';
      this.uploadSuccessful.emit();
    } catch (error) {
      this.errorMessage = (error instanceof Error) ? error.message : 'Upload error occurred.';
      this.resetErrorMessage();
    } finally {
      this.isLoading = false;
    }
  }, REQUEST_DEBOUNCE);
}
