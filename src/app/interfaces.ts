export interface Category {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  releaseDate: string;
  formats: {[key: string]: { res: string, size: number}};
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  categories: string[];
  releaseDate?: string;
  highestQuality: {
    format_name: any,
    size: number,
    res: string,
  };
}

