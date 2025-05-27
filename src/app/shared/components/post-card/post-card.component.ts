import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Post } from '@app/models/post.model';
import { UserService } from '@app/core/services/user.service';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '@app/models/user.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;

  userService = inject(UserService);

  user$!: Observable<User>;
  profilePictureUrl: Observable<string> = new Observable<string>();
  timestamp: string = '2h ago';

  ngOnInit() {
    this.user$ = this.userService.getUser(this.post.userId).pipe(
      map((user) => user),
      catchError(() =>
        of({
          id: 1,
          name: 'Guest',
          username: 'Guest',
          email: 'guest@example.com',
          address: {
            street: '123 Main St',
            suite: 'Apt. #123',
            city: 'New York',
            zipcode: '10001',
            geo: {
              lat: '40.7128',
              lng: '-74.0060',
            },
          },
          phone: '1-212-555-1234',
          website: 'https://example.com',
          company: {
            name: 'Example Inc.',
            catchPhrase: 'Example description',
            bs: 'Example BS',
          },
        })
      )
    );
    this.profilePictureUrl = this.getProfilePictureUrl(this.post.userId);
  }

  private getProfilePictureUrl(userId: number): Observable<string> {
    // return this.userService.getUserPhotos(userId).pipe(
    //   map((photos) => {
    //     return photos.map((photo) => photo.url)[0] ?? '/default-avatar.png';
    //   })
    // );

    return of('/default-avatar.png'); // Placeholder for default avatar
  }
}
