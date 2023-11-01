import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API } from './constants';
import { Author, Category, ProcessedVideo } from './interfaces';
import { Observable, combineLatest, map } from 'rxjs';

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
    return combineLatest([this.getAuthors(), this.getCategories()]).pipe(
      map(([authors, categories]) => {
        const videos: ProcessedVideo[] = [];

        authors.forEach((author: Author) => {
          author.videos.forEach((video) => videos.push({
            id: author.id,
            name: video.name,
            author: author.name,
            categories: video.catIds.map((id) => categories.find(el => el.id === id)?.name ?? ''),
            releaseDate: video.releaseDate,
            highestQuality: {...this.getTheHighestQuality(video.formats)}
          }));
        })
      
        return videos;
      })
    );
  }

  getTheHighestQuality(formats: {[key: string]: { res: string, size: number}}):
  { id: number, format_name: string, res: string, size: number } {
    const res: string[] = [];
    const size: number[] = [];
    const max = {id: 0, format_name: '', res: '', size: 0};
    Object.entries(formats).forEach(([format_name, format], index) => {
      const resNumber = Number(format.res.replace('p', ''));
      if (format.size > max.size && Number(format.res.replace('p', ''))) {
        max.id = index; 
        max.format_name = format_name;
        max.size = format.size;
        max.res = format.res;
      }
    });

    return max;
  }
}
