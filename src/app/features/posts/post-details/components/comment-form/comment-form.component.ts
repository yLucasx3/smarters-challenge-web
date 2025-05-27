import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Comment } from '@app/models/comment.model';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
  @Input({ required: true }) postId!: number;
  @Output() commentAdded = new EventEmitter<Comment>();
  commentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      body: ['', Validators.required],
    });
  }

  get name() {
    return this.commentForm.get('name')!;
  }
  get email() {
    return this.commentForm.get('email')!;
  }
  get body() {
    return this.commentForm.get('body')!;
  }

  onSubmit() {
    if (this.commentForm.valid) {
      const newComment: Comment = {
        postId: this.postId,
        id: Date.now(),
        name: this.commentForm.value.name,
        email: this.commentForm.value.email,
        body: this.commentForm.value.body,
      };
      this.commentAdded.emit(newComment);
      this.commentForm.reset();
    }
  }
}
