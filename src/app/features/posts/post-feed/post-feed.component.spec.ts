import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostFeedComponent } from './post-feed.component';
import { PostService } from '@app/core/services/post.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Post } from '@app/models/post.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  template: '',
})
class SearchBarStubComponent {
  @Output() search = new EventEmitter<string>();
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: '',
})
class PaginationStubComponent {
  @Input() currentPage!: number;
  @Input() pageSize!: number;
  @Input() totalItems!: number;
  @Output() pageChange = new EventEmitter<number>();
}

@Component({
  selector: 'app-post-card',
  standalone: true,
  template: '',
})
class PostCardStubComponent {
  @Input() post!: Post;
}

@Component({
  selector: 'app-post-card-skeleton',
  standalone: true,
  template: '',
})
class PostCardSkeletonStubComponent {}

describe('PostFeedComponent', () => {
  let component: PostFeedComponent;
  let fixture: ComponentFixture<PostFeedComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let mockPosts: Post[];

  beforeEach(async () => {
    // Mock PostService
    mockPosts = [
      {
        id: 1,
        userId: 1,
        title: 'Post 1',
        body: 'This is a test post with enough words to truncate',
      },
      {
        id: 2,
        userId: 1,
        title: 'Post 2',
        body: 'Another test post with enough words to truncate',
      },
    ];
    postServiceSpy = jasmine.createSpyObj('PostService', ['getPosts']);
    postServiceSpy.getPosts.and.returnValue(of(mockPosts));

    await TestBed.configureTestingModule({
      imports: [
        PostFeedComponent,
        RouterTestingModule,
        SearchBarStubComponent,
        PaginationStubComponent,
        PostCardStubComponent,
        PostCardSkeletonStubComponent,
      ],
      providers: [{ provide: PostService, useValue: postServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PostFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show skeleton loading initially', () => {
    component.isLoading$ = new BehaviorSubject<boolean>(true);
    fixture.detectChanges();

    const skeletons = fixture.debugElement.queryAll(
      By.css('app-post-card-skeleton')
    );
    expect(skeletons.length).toBe(10); // 10 skeleton cards as defined in template
    const posts = fixture.debugElement.queryAll(By.css('app-post-card'));
    expect(posts.length).toBe(0); // No posts while loading
  });

  it('should display posts after loading', () => {
    component.isLoading$ = new BehaviorSubject<boolean>(false);
    fixture.detectChanges();

    const posts = fixture.debugElement.queryAll(By.css('app-post-card'));
    expect(posts.length).toBe(2); // 2 mock posts
    expect(postServiceSpy.getPosts).toHaveBeenCalled();
    const skeletons = fixture.debugElement.queryAll(
      By.css('app-post-card-skeleton')
    );
    expect(skeletons.length).toBe(0); // No skeletons after loading
  });

  it('should filter posts based on search term', () => {
    component.isLoading$ = new BehaviorSubject<boolean>(false);
    fixture.detectChanges();

    const searchBar = fixture.debugElement.query(
      By.directive(SearchBarStubComponent)
    );
    (searchBar.componentInstance as SearchBarStubComponent).search.emit(
      'Post 1'
    );
    fixture.detectChanges();

    const posts = fixture.debugElement.queryAll(By.css('app-post-card'));
    expect(posts.length).toBe(1); // Only "Post 1" matches
    const postCard = posts[0].componentInstance as PostCardStubComponent;
    expect(postCard.post.title).toBe('Post 1');
  });

  it('should show empty state when no posts match search', () => {
    component.isLoading$ = new BehaviorSubject<boolean>(false);
    fixture.detectChanges();

    const searchBar = fixture.debugElement.query(
      By.directive(SearchBarStubComponent)
    );
    (searchBar.componentInstance as SearchBarStubComponent).search.emit(
      'Nonexistent'
    );
    fixture.detectChanges();

    const emptyMessage = fixture.debugElement.query(
      By.css('.flex-col.items-center.justify-center span')
    );
    expect(emptyMessage.nativeElement.textContent).toBe('No posts found.');
    const posts = fixture.debugElement.queryAll(By.css('app-post-card'));
    expect(posts.length).toBe(0);
  });

  it('should handle pagination', () => {
    component.isLoading$ = new BehaviorSubject<boolean>(false);
    component.totalPosts = 20; // 2 pages with pageSize = 10
    fixture.detectChanges();

    const pagination = fixture.debugElement.query(
      By.directive(PaginationStubComponent)
    );
    (pagination.componentInstance as PaginationStubComponent).pageChange.emit(
      2
    );
    fixture.detectChanges();

    expect(component.currentPage$.value).toBe(2);
    // Since we only have 2 mock posts, they'll still show, but pagination logic should work
    const posts = fixture.debugElement.queryAll(By.css('app-post-card'));
    expect(posts.length).toBe(2);
  });

  it('should handle API error gracefully', () => {
    postServiceSpy.getPosts.and.returnValue(
      throwError(() => new Error('API Error'))
    );
    component.isLoading$ = new BehaviorSubject<boolean>(true);
    fixture.detectChanges();

    component.isLoading$.next(false);
    fixture.detectChanges();

    const posts = fixture.debugElement.queryAll(By.css('app-post-card'));
    expect(posts.length).toBe(0);
    const emptyMessage = fixture.debugElement.query(
      By.css('.flex-col.items-center.justify-center span')
    );
    expect(emptyMessage.nativeElement.textContent).toBe('No posts found.');
  });

  it('should truncate post body correctly', () => {
    const body =
      'This is a test post with enough words to truncate because it is very long';
    const truncated = component.getBody(body);
    expect(truncated.split(' ').length).toBe(21); // 20 words + '...'
    expect(truncated.endsWith('...')).toBeTrue();
  });
});
