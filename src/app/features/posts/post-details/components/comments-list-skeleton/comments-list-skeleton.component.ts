import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-comments-list-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments-list-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsListSkeletonComponent {}
