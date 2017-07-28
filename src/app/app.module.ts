import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AgmCoreModule} from '@agm/core';
import {RouterModule, Routes} from '@angular/router';
import {PlaceSearchComponent} from './components/place-search/place-search.component';
import {DirectionSearchComponent} from './components/direction-search/direction-search.component';
import {HotelSearchComponent} from './components/hotel-search/hotel-search.component';
import {HomeComponent} from './components/home/home.component';
import {DirectionsMapDirective} from './directives/google-map.directive';
import {HotelMapDirective} from './directives/google-map-hotel.directive';
import {DashboardComponent} from './components/dashboard/dashboard.component';


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
    path: 'hotel-search',
    component: HotelSearchComponent
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
    HotelMapDirective,
    DirectionSearchComponent,
    HotelSearchComponent,
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
