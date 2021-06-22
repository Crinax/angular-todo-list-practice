import { Component } from '@angular/core';
import { ProjectService } from './services/projects.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: [ProjectService]
})
export class AppComponent { }
