import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, combineLatest, concat, map } from 'rxjs';

import { API } from '../../constants';
import { Author, Category, ProcessedVideo, Video } from './interfaces';
import { PatchVideoResponse, VideoForm } from '../video-add-edit/video-add-edit-interfaces';

const DEFAULT_FORMAT = { one: { res: '1080p', size: 1000 }};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  authors = new BehaviorSubject<Author[]>([]);
  authors$ = this.authors.asObservable();
  videos = new BehaviorSubject<ProcessedVideo[]>([]);
  maxId = new BehaviorSubject(0);

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/categories`);
  }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${API}/authors`).pipe(map(authors => {
      authors.forEach((author) => {
        if (author.videos.length) {
          const maxId = author.videos.reduce((prev, current) => (prev && prev.id > current.id) ? prev : current).id;
          if (maxId > this.maxId.getValue()) this.maxId.next(maxId);
        }
      });
      this.authors.next(authors);
      return authors;
    }));
  }

  /** Restructure Authors and Categories to get a videos list fitting the table structure */
  getVideos(): Observable<ProcessedVideo[]> {
    return combineLatest([this.getAuthors(), this.getCategories()]).pipe(
      map(([authors, categories]) => {
        const videos: ProcessedVideo[] = [];

        authors.forEach((author: Author) => {
          author.videos.forEach((video) => videos.push({
            id: video.id,
            name: video.name,
            author: author.name,
            authorId: author.id,
            categories: video.catIds.map((id) => categories.find(el => el.id === id)?.name ?? '').sort(),
            releaseDate: video.releaseDate,
            highestQuality: {...this.getTheHighestQuality(video.formats)}
          }));
        });

        this.videos.next(videos);
        return videos;
      })
    );
  }

  /** Get video by ID from structured video list */
  getProcessedVideoById(id: number): ProcessedVideo | undefined {
    return this.videos.getValue().find((video) => video.id === id);
  }

  /** Find the highest quality depending on the biggest size and resolution */
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

  /** Add video by adding the video to selected Author and patching the selected Author */
  addVideoToSelectedAuthor(videoContols: VideoForm): Observable<PatchVideoResponse> {
    const author = {...videoContols.author.value};
    const videoId = this.maxId.getValue() + 1
    this.maxId.next(videoId);

    author.videos.push({
      id: this.maxId.getValue(),
      catIds: videoContols.categories.value,
      name: videoContols.name.value,
      formats: DEFAULT_FORMAT,
      releaseDate: new Date().toISOString().split('T')[0],
    });

    return this.http.patch<PatchVideoResponse>(`${API}/authors/${author.id}`, author);
  }

  /** Edit video by patching Author with the new data or 
   * moving the video and patching the previous Author and selected Author */
  editSelectedVideo(videoContols: VideoForm, existingVideoId: number) {
    const newAuthor = {...videoContols.author.value};
    const existingVideo = this.getProcessedVideoById(existingVideoId);
    let moveResult;

    if (newAuthor.id === existingVideo?.authorId) {
      newAuthor.videos.forEach((video) => {
        if (video.id === existingVideoId) {
          video.name = videoContols.name.value;
          video.catIds = videoContols.categories.value;
        }
      });

      // If the Author didn't change, we can just patch the same Author
      return this.http.put<PatchVideoResponse>(`${API}/authors/${existingVideo.authorId}`, newAuthor);
    } else {
      // If the Author changed, we must move the video under the new Author, 
      // and remove the video from previous Author
      moveResult = this.moveVideoToAnotherAuthor(
        newAuthor,
        videoContols.categories.value,
        videoContols.name.value,
        existingVideo
      );
    }

    return concat(this.http.patch<PatchVideoResponse>(`${API}/authors/${newAuthor.id}`, moveResult?.newAuthor),
                    this.http.patch<PatchVideoResponse>(`${API}/authors/${existingVideo?.authorId}`, moveResult?.existingAuthor));
  }

  /** Move function by removing video from the previous Author and adding it to the new Author */
  private moveVideoToAnotherAuthor(newAuthor: Author, categories: number[], name: string, existingVideo?: ProcessedVideo) {
    if (existingVideo) {
      const existingAuthor = this.getAuthorWithId(existingVideo.authorId);
  
      if (existingAuthor) {
        const videoFromAuthor = this.getVideoById(existingAuthor, existingVideo.id);
        existingAuthor.videos = this.removeVideoFromArray(existingAuthor, existingVideo.id);
        if (videoFromAuthor) newAuthor?.videos.push({...videoFromAuthor, name: name, catIds: categories});
      }
  
      return {newAuthor, existingAuthor};
    }
    
    return undefined;
  }

  private getAuthorWithId(id: number): Author | undefined {
    return this.authors.getValue().find((author) => author.id === id);
  }

  /** Get unprocessed video by id */
  private getVideoById(author: Author, id: number): Video | undefined {
    return author.videos.find((video) => video.id === id);
  }

  private removeVideoFromArray(author: Author, id: number): Video[] {
    return author.videos.filter((video) => video.id !== id);
  }

  /** Delete video by removing the video from the Author and patching the Author data */
  deleteVideo(authorId: number, videoId: number) {
    const author = this.getAuthorWithId(authorId);
    if (author) author.videos = this.removeVideoFromArray(author, videoId);

    return this.http.patch<PatchVideoResponse>(`${API}/authors/${authorId}`, author);
  }
}
