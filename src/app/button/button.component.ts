import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonType } from './button-type';

@Component({
  selector: 'mi-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() buttonType = ButtonType.noStyle;
  @Input() text: string = 'Button';
}
