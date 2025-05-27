import { Observable } from 'rxjs';
import { Photo } from '../../models/photo.model';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PhotosService extends BaseService {
  getPhotos(): Observable<Photo[]> {
    return this.get<Photo[]>('/photos');
  }

  getPhoto(id: number): Observable<Photo> {
    return this.get(`/photos/${id}`);
  }
}
