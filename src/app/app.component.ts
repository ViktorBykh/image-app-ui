import { Component, ViewChild } from '@angular/core';
import { UploadComponent } from './upload/upload.component';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    UploadComponent,
    SearchComponent,
    ResultsComponent
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Image APP';
  searchResults: { url: string }[] = [];
  @ViewChild(ResultsComponent) resultsComponent!: ResultsComponent;

  onSearchResults(results: { url: string }[]): void {
    this.searchResults = results;
  }

  onUploadSuccess(): void {
    if (this.resultsComponent) {
      this.resultsComponent.loadImages();
    }
  }
}
