import { Component, OnInit, Input, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../services/projects.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent implements OnInit {
  @Input() title!: string;
  dialogForm: any;
  projects: any;
    constructor(public dialog: MatDialog, private projectService: ProjectService) { }
    ngOnInit(): void {}
    onClickEvent(): void {
        const dialogRef = this.dialog.open(AddTodoDialog, {
            width: '40vw',
            data: this.projectService
        });
    }
}
export interface DialogData { }
@Component({
    selector: 'app-add-todo-dialog',
    templateUrl: 'app-add-todo-dialog.html',
    styleUrls: ['./app-add-todo-dialog.sass']
})
export class AddTodoDialog implements OnInit{
    reactiveForm!: FormGroup
    projects: any;

    constructor(
        public dialogRef: MatDialogRef<AddTodoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.initForm();
        this.projects = (<ProjectService>this.data).getData()!.getProjects();
    }
    initForm() {
        this.reactiveForm = this.fb.group({
            todo_name: ['', [Validators.required]],
            project: ['', [Validators.required]],
            category_name: ['']
        });
    }
    inputHandler() {
        var selectValue = <HTMLInputElement>document.querySelector('.project-select');
        if (selectValue!.value == 'new') {
            document.querySelector('.category-name')?.setAttribute('type', 'text');
            this.reactiveForm.controls['category_name'].setValidators([Validators.required]);
        }
        else {
            document.querySelector('.category-name')?.setAttribute('type', 'hidden');
            this.reactiveForm.controls['category_name'].clearValidators();
        }
        this.reactiveForm.controls['category_name'].updateValueAndValidity();
    }
    onSubmit() {
      const controls = this.reactiveForm!.controls;
      if (this.reactiveForm!.invalid) {
          Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
          return;
      }
      this.sendPostRequest(this.reactiveForm!.value);
    }
    sendPostRequest(data: any) {
        var service = <ProjectService>this.data;
        this.closeEvent();
        service.sendPost(data);
    }
    closeEvent(): void {
      this.dialogRef.close();
    }
}
