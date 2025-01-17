import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { debounce } from 'lodash';
import { REQUEST_DEBOUNCE } from '../shared/constants';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
})
export class ResultsComponent implements OnInit {
  @Input() results: { url: string }[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  isLoading = false;
  errorMessage: string | null = null; 

  ngOnInit(): void {
    this.isLoading = true;
    const debouncedLoadImages = debounce(() => this.loadImages(), REQUEST_DEBOUNCE);
    debouncedLoadImages();
  }

  private resetErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000); 
  }

  async loadImages(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    await this.handleResultRequest();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadImages();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadImages();
    }
  }

  updateResults(newResults: { url: string }[]): void {
    this.results = newResults;
  }

  private async handleResultRequest() {
    try {
      const response = await fetch(`${environment.BASE_URL}/get?page=${this.currentPage}&pageSize=${this.pageSize}`);
      const data = await response.json();
      if (response.ok) {
        this.results = data.images;
        this.totalPages = Math.ceil(data.totalImages / this.pageSize);
      } else {
        this.errorMessage = 'Failed to fetch images.';
        this.resetErrorMessage();
      }
    } catch {
      this.errorMessage = 'Error fetching images. Please try again later.';
      this.resetErrorMessage();
    } finally {
      this.isLoading = false;
    }
  }
}
