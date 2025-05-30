import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Observable,
  BehaviorSubject,
  combineLatest,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { SearchBarComponent } from '@app/shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { PostCardComponent } from '@app/shared/components/post-card/post-card.component';
import { RouterModule } from '@angular/router';
import { PostService } from '@app/core/services/post.service';
import { Post } from '@app/models/post.model';
import { PostCardSkeletonComponent } from '@app/shared/components/post-card/post-card-skeleton/post-card-skeleton.component';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    PaginationComponent,
    PostCardComponent,
    PostCardSkeletonComponent,
    RouterModule,
  ],
  templateUrl: './post-feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFeedComponent {
  private postService = inject(PostService);

  posts$!: Observable<Post[]>;
  isLoading$ = new BehaviorSubject<boolean>(true);
  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize = 10;
  totalPosts = 100;

  constructor() {
    this.posts$ = combineLatest([
      this.postService.getPosts().pipe(
        map((posts) => {
          this.isLoading$.next(false);
          return posts.map((post) => ({
            ...post,
            body: this.getBody(post.body),
          }));
        }),
        startWith([]),
        catchError(() => {
          this.isLoading$.next(false);
          return of([]);
        })
      ),
      this.searchTerm$,
      this.currentPage$,
    ]).pipe(
      map(([posts, searchTerm, currentPage]) => {
        let filteredPosts = posts;
        if (searchTerm) {
          filteredPosts = posts.filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        const startIndex = (currentPage - 1) * this.pageSize;
        return filteredPosts.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  getBody(body: string): string {
    return body.split(' ').slice(0, 20).join(' ') + '...';
  }

  onSearch(term: string): void {
    this.searchTerm$.next(term);
    this.currentPage$.next(1);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalPosts / this.pageSize)) {
      this.currentPage$.next(page);
    }
  }
}
