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
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CommentsListComponent } from '@app/shared/components/comments-list/comments-list.component';
import { CommentFormComponent } from '@app/shared/components/comment-form/comment-form.component';
import { Post } from '@app/core/models/post.model';
import { UserService } from '@app/core/services/user.service';
import { Comment } from '@app/core/models/comment.model';
import { PostCardComponent } from '@app/shared/components/post-card/post-card.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommentsListComponent,
    CommentFormComponent,
    CommonModule,
    RouterModule,
    PostCardComponent,
  ],
  templateUrl: './post-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailComponent implements OnInit {
  private postService = inject(PostService);
  private userService = inject(UserService);

  private route = inject(ActivatedRoute);
  post$!: Observable<Post>;
  user$!: Observable<{ username: string; handle: string }>;
  comments$!: Observable<Comment[]>;
  postId!: number;
  localComments: Comment[] = [];

  ngOnInit() {
    this.post$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.postId = +params.get('id')!;
        return this.postService.getPost(this.postId);
      }),
      catchError(() =>
        of({ id: 0, title: 'Error', body: 'Post not found', userId: 0 } as Post)
      )
    );

    this.user$ = this.post$.pipe(
      switchMap((post) => this.userService.getUser(post.userId)),
      map((user) => ({
        username: user.name,
        handle: `@${user.username.toLowerCase()}`,
      })),
      catchError(() => of({ username: 'Unknown User', handle: '@unknown' }))
    );

    this.comments$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.postService.getPostComements(+params.get('id')!)
      ),
      catchError(() => of([] as Comment[]))
    );
  }

  onCommentAdded(newComment: Comment) {
    this.localComments = [...this.localComments, newComment];
  }

  goBack() {
    window.history.back();
  }
}
