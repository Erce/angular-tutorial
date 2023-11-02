import { FormControl } from "@angular/forms";
import { Author, Video } from "../data/interfaces";

export interface VideoForm {
    name: FormControl<string>;
    author: FormControl<Author>;
    categories: FormControl<number[]>;
}

export interface PatchVideoResponse {
    id: number;
    name: string;
    videos: Video[];
}