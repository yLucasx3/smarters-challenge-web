import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '@app/models/comment.model';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsListComponent {
  @Input() remoteComments: Comment[] = [];
  @Input() localComments: Comment[] = [];
}
