import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API } from './constants';
import { Author, Category, ProcessedVideo } from './interfaces';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/categories`);
  }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${API}/authors`);
  }

  getVideos(): Observable<ProcessedVideo[]> {
    return of([]);
    // Get the Authors and iterate over the videos inside each one. Add the missing information to get a ProcessedVideo
    // return this.getAuthors().pipe(
    // ...
  }
}
