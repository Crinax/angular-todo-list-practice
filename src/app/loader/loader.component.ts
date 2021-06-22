import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/projects.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.sass']
})
export class LoaderComponent implements OnInit {
    @Input() isHidden: boolean = false;
    constructor(private service: ProjectService) {
        this.service.invokeEvent$.subscribe(val => {
            switch (val) {
                case 'hideLoader': {
                    this.hideLoader();
                    break;
                }
                case 'showLoader': {
                    this.showLoader();
                    break;
                }
            }
        });
    }

    ngOnInit(): void {}
    hideLoader(): void { this.isHidden = true; }
    showLoader(): void { this.isHidden = false; }
}
