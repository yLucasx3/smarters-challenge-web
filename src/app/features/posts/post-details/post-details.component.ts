import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CommentFormComponent } from '@app/features/posts/post-details/components/comment-form/comment-form.component';
import { Post } from '@app/models/post.model';
import { UserService } from '@app/core/services/user.service';
import { Comment } from '@app/models/comment.model';
import { PostCardComponent } from '@app/shared/components/post-card/post-card.component';
import { User } from '@app/models/user.model';
import { CommentsListComponent } from './components/comments-list/comments-list.component';
import { PostCardSkeletonComponent } from '@app/shared/components/post-card/post-card-skeleton/post-card-skeleton.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommentsListComponent,
    CommentFormComponent,
    CommonModule,
    RouterModule,
    PostCardComponent,
    PostCardSkeletonComponent,
  ],
  templateUrl: './post-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailComponent implements OnInit {
  private postService = inject(PostService);
  private userService = inject(UserService);

  private route = inject(ActivatedRoute);
  post$!: Observable<Post>;
  isPostLoading$ = new BehaviorSubject<boolean>(true);
  isCommentsLoading$ = new BehaviorSubject<boolean>(true);
  user$!: Observable<User>;
  comments$!: Observable<Comment[]>;
  postId!: number;
  localComments: Comment[] = [];

  ngOnInit() {
    this.post$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.postId = +params.get('id')!;
        return this.postService.getPost(this.postId);
      }),
      map((post) => {
        this.isPostLoading$.next(false);
        return post;
      }),
      catchError(() => {
        this.isPostLoading$.next(false);
        return of({
          id: 0,
          title: 'Error',
          body: 'Post not found',
          userId: 0,
        } as Post);
      })
    );

    this.user$ = this.post$.pipe(
      switchMap((post) => this.userService.getUser(post.userId))
    );

    this.comments$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.postService.getPostComements(+params.get('id')!)
      ),
      map((comments) => {
        this.isCommentsLoading$.next(false);
        return comments;
      }),
      catchError(() => {
        this.isCommentsLoading$.next(false);
        return of([] as Comment[]);
      })
    );
  }

  onCommentAdded(newComment: Comment) {
    this.localComments = [...this.localComments, newComment];
  }

  goBack() {
    window.history.back();
  }
}
