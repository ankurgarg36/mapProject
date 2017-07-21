import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AgmCoreModule} from '@agm/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {HomeComponent} from 'app/home.component';
import {PlaceSearchComponent} from './place-search.component';
import {DirectionSearchComponent} from './direction-search.component';
import {DirectionsMapDirective} from './google-map.directive';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'place-search',
    component: PlaceSearchComponent
  },
  {
    path: 'direction-search',
    component: DirectionSearchComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
];
@NgModule({
  declarations: [
    DirectionsMapDirective,
    DashboardComponent,
    PlaceSearchComponent,
    HomeComponent,
    DirectionSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDm5LIesZn8QE7AxlBv0-tARdR_sQz4dU8',
      libraries: ['places']
    }),
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class AppModule {
}
