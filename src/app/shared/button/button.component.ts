import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonType } from '../types/button-type';

@Component({
  selector: 'mi-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  /** Please give ButtonType for button style */
  @Input() buttonType = ButtonType.noStyle;
  @Input() text = 'Button';
  @Input() disabled = false;
}
