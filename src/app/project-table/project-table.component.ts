import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/projects.service';



@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.sass'],
})
export class ProjectTableComponent implements OnInit {
  projects?: any;

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectService.runStream();
    this.waiting();
  }
  waiting() {
    this.projects = undefined;
    var waitResult = setInterval(() => {
        this.projects = this.projectService.getData();
        if (this.projects) {
            this.projects = this.projects.getProjects();
            clearInterval(waitResult);
        }
    }, 100)
  }
  changeState(todoId: number, projectId: number, isChecked: boolean) {
    this.projectService.sendPatch(todoId, projectId, isChecked);
    this.waiting();
  }
}
