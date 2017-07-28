import {Component} from '@angular/core';
/**
 * Created by ankur on 5/7/17.
 */
@Component({
    selector: 'dashboard-component',
    template: `
	    <nav class="navbar navbar-default">
		    <div class="container-fluid">
			    <div class="navbar-header">
				    <a class="navbar-brand" href="/"><img src="../assets/logo.png" style="margin-top: -15px;
    height: 51px;"/></a>
			    </div>
			    <ul class="nav navbar-nav">
				    <li class="active">
				    <a  [routerLink]="['/home']" routerLinkActive="current" >Home</a>
			    </ul>
		    </div>
	    </nav>
    <router-outlet></router-outlet>`,
})
export class DashboardComponent {
}
