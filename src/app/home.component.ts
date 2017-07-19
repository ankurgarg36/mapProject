import {Component} from '@angular/core';
import {Router} from '@angular/router';
/**
 * Created by ankur on 5/7/17.
 */
@Component({
    selector: 'home-component',
    template: `
		<div class="jumbotron" (click)="showMapPage()" style="cursor: pointer">
			<h1>Angular 2 + Google Maps Places Autocomplete </h1>
			<p>The Places Autocomplete by Google Maps is very helpful as it allows a user to search for an address or
				specific location.
				I’ll combine the Places Autocomplete API with a Google Map using the angular2-google-map module.</p>
		</div>`
})
export class HomeComponent {
    constructor(private router: Router) {
    }

    showMapPage() {
        this.router.navigate(['/app']);
    }
}
