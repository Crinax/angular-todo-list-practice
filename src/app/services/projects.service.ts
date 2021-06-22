import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Projects } from '../project-class/project-class';
import { interval, Subscription, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax'

@Injectable()
export class ProjectService {
    private data?: Projects;
    private intervalRequest$?: Subscription;

    invokeEvent: Subject<any> = new Subject();
    invokeEvent$ = this.invokeEvent.asObservable();

    constructor(private http: HttpClient) { }

    runStream() {
        this.intervalRequest$ = interval(5000).subscribe(v => {
            var request$ = ajax('https://blooming-citadel-71629.herokuapp.com/api/projects')
            .subscribe(result => {
                this.data = new Projects(result.response);
                this.hideLoader();
                request$.unsubscribe();
            })
        });
    }
    stopStream() {
        if (this.intervalRequest$) {
            this.intervalRequest$.unsubscribe();
            this.intervalRequest$ = undefined;
        }
    }
    getData() { return this.data; }
    hideLoader() { this.invokeEvent.next('hideLoader'); }
    showLoader() { this.invokeEvent.next('showLoader'); }
    sendPatch(todoId: number, projectId: number, isChecked: boolean) {
        this.showLoader();
        this.data = undefined;
        var request$ = ajax({
            url: `https://blooming-citadel-71629.herokuapp.com/api/projects/${projectId}/todo/${todoId}`,
            method: 'PATCH',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'origin, content-type',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: {isChecked: isChecked}
        }).subscribe(result => {
            if (result.response['status'] == 'ok') {
                this.data = new Projects(result.response['projects']);
                window.location.reload();
                this.hideLoader();
                request$.unsubscribe();
            }
            else {
                console.log(result);
                request$.unsubscribe();
            }
        })
    }
    sendPost(data: any) {
        this.showLoader();
        this.data = undefined;
        var request$ = ajax({
            url: 'https://blooming-citadel-71629.herokuapp.com/api/todos',
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'origin, content-type',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: {
                project: data['project'],
                todo_name: data['todo_name'],
                category_name: data['category_name']
            }
        }).subscribe(result => {
            if (result.response['status'] == 'ok') {
                this.data = new Projects(result.response['projects']);
                this.hideLoader();
                request$.unsubscribe();
            }
            else {
                console.log(result);
                request$.unsubscribe();
            }
        });
    }
}
