import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {GoogleMapsAPIWrapper, LatLngLiteral, MapsAPILoader} from '@agm/core';
import {Hotel, HotelMapDirective} from './google-map-hotel.directive';

declare var google: any;
@Component({
  selector: 'hotel-search-component',
  templateUrl: './hotel-search-component.html',
  styles: ['agm-map {width: 100%;height: 600px;}'],
  providers: [GoogleMapsAPIWrapper]
})
export class HotelSearchComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public latLang: LatLngLiteral;
  @ViewChild(HotelMapDirective) vc: HotelMapDirective;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  @ViewChild('infocontent')
  public infocontentElementRef: ElementRef;

  public hotel: Hotel;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private gmapsApi: GoogleMapsAPIWrapper) {
  }

  ngOnInit() {
    //  set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address'],
        componentRestrictions: {country: 'in'},
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.vc.lat = place.geometry.location.lat();
          this.vc.lang = place.geometry.location.lng();
          this.vc.infoContent = this.infocontentElementRef.nativeElement;

          this.mapsAPILoader.load().then(() => {
            this.vc.updateDirections();
          });

          // set latitude, longitude and zoom
          /*this.latitude = place.geometry.location.lat();
           this.longitude = place.geometry.location.lng();
           this.zoom = 12;*/
        });
      });
    });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  MarkerClickHandler(hotel: Hotel) {
    this.hotel = hotel;
    console.log(this.hotel);
  }
}

