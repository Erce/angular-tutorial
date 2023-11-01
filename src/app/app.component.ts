import { Component } from '@angular/core';
import { ButtonType } from './button/button-type';

@Component({
  selector: 'mi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  protected readonly buttonType = ButtonType;
}
