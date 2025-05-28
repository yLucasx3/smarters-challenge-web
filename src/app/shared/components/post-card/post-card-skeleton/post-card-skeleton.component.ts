import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-post-card-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCardSkeletonComponent {}
