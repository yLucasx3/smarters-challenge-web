import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '@app/models/comment.model';
import { CommentsListSkeletonComponent } from '../comments-list-skeleton/comments-list-skeleton.component';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [CommonModule, CommentsListSkeletonComponent],
  templateUrl: './comments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsListComponent {
  @Input() remoteComments: Comment[] = [];
  @Input() localComments: Comment[] = [];
  @Input() isLoading: boolean | null = null;
}
