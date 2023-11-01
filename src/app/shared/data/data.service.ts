import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

import { API } from '../../constants';
import { Author, Category, ProcessedVideo } from './interfaces';
import { AddVideoResponse, VideoForm } from '../video-add/video-add-interfaces';


const DEFAULT_FORMAT = { one: { res: '1080p', size: 1000 }};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  authors = new BehaviorSubject<Author[]>([]);
  authors$ = this.authors.asObservable();
  maxId = new BehaviorSubject(0);

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/categories`);
  }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${API}/authors`).pipe(map(authors => {
      authors.forEach((author) => {
        const maxId = author.videos.reduce((prev, current) => (prev && prev.id > current.id) ? prev : current).id;
        if (maxId > this.maxId.getValue())
          this.maxId.next(maxId);
        });
      this.authors.next(authors);
      return authors;
    }));
  }

  addVideoToSelectedAuthor(videoContols: VideoForm): Observable<AddVideoResponse> {
    const authorId = videoContols.author.value.id;
    const videoId = this.maxId.getValue() + 1
    this.maxId.next(videoId);

    const author = {...videoContols.author.value};
    author.videos.push({
      id: this.maxId.getValue(),
      catIds: videoContols.categories.value,
      name: videoContols.name.value,
      formats: DEFAULT_FORMAT,
      releaseDate: new Date().toISOString().split('T')[0],
    });

    return this.http.put<AddVideoResponse>(`${API}/authors/${authorId}`, author);
  }

  getVideos(): Observable<ProcessedVideo[]> {
    return combineLatest([this.getAuthors(), this.getCategories()]).pipe(
      map(([authors, categories]) => {
        const videos: ProcessedVideo[] = [];

        authors.forEach((author: Author) => {
          author.videos.forEach((video) => videos.push({
            id: video.id,
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
    const max = {id: 0, format_name: '', res: '', size: 0};
    Object.entries(formats).forEach(([format_name, format], index) => {
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
