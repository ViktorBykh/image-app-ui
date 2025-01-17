import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { debounce } from 'lodash';
import { ERROR_MESSAGE_TIMEOUT, REQUEST_DEBOUNCE } from '../shared/constants';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  query = '';
  errorMessage: string | null = null;
  isLoading = false;
  isError = false;
  readonly defaultPlaceholder = 'Enter recognition keywords...';
  placeholderText = this.defaultPlaceholder;

  @Output() searchResults = new EventEmitter<{ url: string }[]>();

  async onSearch(): Promise<void> {
    this.query = this.query.trim();
    if (!this.query) {
      console.error('Search query cannot be empty.');
      this.errorMessage = 'Search query cannot be empty.';
      this.resetErrorMessage();
      return;
    }

    this.isLoading = true;
    this.isError = false;
    this.errorMessage = null;

    await this.handleSearchRequest();
  }

  private handleSearchRequest = debounce(async (): Promise<void> => {
    try {
      const response = await fetch(`${environment.BASE_URL}/search?query=${encodeURIComponent(this.query)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const results = await response.json();
      this.searchResults.emit(results);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      this.isError = true;
      this.errorMessage = 'Search failed. Please try again.';
      this.resetErrorMessage();
    } finally {
      this.isLoading = false;
    }
  }, REQUEST_DEBOUNCE);

  resetErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = null;
      this.isError = false;
    }, ERROR_MESSAGE_TIMEOUT);
  }

  clearError(): void {
    this.errorMessage = null;
    this.isError = false;
  }

  onFocus(): void {
    this.placeholderText = '';
    this.errorMessage = null;
  }

  onBlur(): void {
    this.placeholderText = this.query || this.defaultPlaceholder;
  }
}
