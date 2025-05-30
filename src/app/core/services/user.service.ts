import { Observable } from 'rxjs';
import { Photo } from '../../models/photo.model';
import { BaseService } from './base.service';
import { User } from '../../models/user.model';
import { Injectable } from '@angular/core';
import { Post } from '../../models/post.model';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  getUsers(): Observable<User[]> {
    return this.get<User[]>('/users');
  }

  getUser(id: number): Observable<User> {
    return this.get<User>(`/users/${id}`);
  }

  getUserPhotos(userId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/users/${userId}/photos`);
  }

  getUserPosts(userId: number): Observable<Post[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/posts`);
  }
}
