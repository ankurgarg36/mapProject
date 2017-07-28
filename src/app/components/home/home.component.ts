import {Component} from '@angular/core';
import {Router} from '@angular/router';
/**
 * Created by ankur on 5/7/17.
 */
@Component({
    selector: 'home-component',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    constructor(private router: Router) {
    }

    showMapPage(path: string) {
        this.router.navigate(['/' + path]);
    }
}
