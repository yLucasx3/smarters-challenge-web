import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { Post } from '@app/models/post.model';
import { UserService } from '@app/core/services/user.service';
import { User } from '@app/models/user.model';

@Component({
  selector: 'app-author-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCardComponent],
  templateUrl: './author-posts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorPostsComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  posts$!: Observable<Post[]>;
  user$!: Observable<User>;
  userId!: number;

  ngOnInit() {
    this.posts$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.userId = +params.get('userId')!;
        return this.userService.getUserPosts(this.userId);
      }),
      map((posts) =>
        posts.map((post) => ({
          ...post,
          body: this.getBody(post.title),
        }))
      )
    );

    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => this.userService.getUser(+params.get('userId')!))
    );
  }

  getBody(body: string): string {
    return body.split(' ').slice(0, 20).join(' ') + '...';
  }

  trackByPostId(index: number, post: Post): number {
    return post.id;
  }
}
