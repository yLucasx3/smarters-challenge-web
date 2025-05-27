import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { BaseService } from './base.service';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class PostService extends BaseService {
  getPosts(): Observable<Post[]> {
    return this.get<Post[]>(`/posts`);
  }

  getPost(id: number): Observable<Post> {
    return this.get<Post>(`/posts/${id}`);
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.get<Post[]>(`/users/${userId}/posts`);
  }

  getPostComements(postId: number): Observable<Comment[]> {
    return this.get<Comment[]>(`/posts/${postId}/comments`);
  }
}
