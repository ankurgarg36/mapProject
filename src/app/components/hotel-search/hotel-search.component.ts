import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {GoogleMapsAPIWrapper, LatLngLiteral, MapsAPILoader} from '@agm/core';
import {Hotel, HotelMapDirective, MapConst} from '../../directives/google-map-hotel.directive';

declare var google: any;
@Component({
  selector: 'hotel-search-component',
  templateUrl: './hotel-search-component.html',
  styleUrls: ['./hotel-search-component.css'],
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

  @ViewChild('infowindowcontent')
  public infowindowcontentElementRef: ElementRef;

  public hotel: Hotel;
  public hotels: any;
  public currentPlaceId: string;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private gmapsApi: GoogleMapsAPIWrapper) {
  }

  ngOnInit() {
    //  set google maps defaults
    this.zoom = 4;
    this.latitude = 28.6471944;
    this.longitude = 76.9528362;

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentPlaceId();
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: [],  // address,establishment,geocode
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
          this.vc.infoWindowContent = this.infowindowcontentElementRef.nativeElement;

          this.mapsAPILoader.load().then(() => {
            this.vc.updateDirections();
          });

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
    this.ngZone.run(() => {
      this.hotel = hotel;
      console.log(this.hotel);
    });
  }

  HotelResultHandler(hotels: any) {
    this.ngZone.run(() => {
      this.hotels = hotels;
    });
  }

  getIcon = (index: any): string => {
    const markerLetter = String.fromCharCode('A'.charCodeAt(0) + (index % 26));
    return MapConst.MARKER_PATH + markerLetter + '.png';
  }

  triggerClick = (obj: any): void => {
    google.maps.event.trigger(obj, 'click');
  }

  setCurrentPlaceId = () => {
    const geocoder = new google.maps.Geocoder;
    const latlng = {lat: this.latitude, lng: this.longitude};
    geocoder.geocode({'location': latlng}, (results, status) => {
      this.ngZone.run(() => {
        const me = this;
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            // console.log(this.longitude); // working
            me.currentPlaceId = results[1].place_id; // not working
          }
        }
      });
    });
    console.log(this.currentPlaceId);
  }
}

