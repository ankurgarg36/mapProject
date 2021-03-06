import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {GoogleMapsAPIWrapper, MapsAPILoader} from '@agm/core';
import {DirectionsMapDirective} from '../../directives/google-map.directive';

declare const google: any;

@Component({
  selector: 'direction-search-component',
  templateUrl: './direction-search-component.html',
  styles: ['agm-map {width: 100%;height: 600px;}'],
  providers: [GoogleMapsAPIWrapper]
})
export class DirectionSearchComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public destinationInput: FormControl;
  public destinationOutput: FormControl;
  public zoom: number;
  public mapCustomStyles: any;
  public estimatedTime: any;
  public estimatedDistance: any;

  @ViewChild('pickupInput')
  public pickupInputElementRef: ElementRef;

  @ViewChild('pickupOutput')
  public pickupOutputElementRef: ElementRef;

  @ViewChild('scrollMe')
  private scrollContainer: ElementRef;

  @ViewChild(DirectionsMapDirective) vc: DirectionsMapDirective;

  public origin: any; //  its a example aleatory position
  public destination: any; //  its a example aleatory position
  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    // set google maps defaults
    this.zoom = 4;
    this.latitude = 28.6471944;
    this.longitude = 76.9528362;

    //  this.mapCustomStyles = this.getMapCusotmStyles();
    // create search FormControl
    this.destinationInput = new FormControl();
    this.destinationOutput = new FormControl();
    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocompleteInput = new google.maps.places.Autocomplete(this.pickupInputElementRef.nativeElement, {
        types: [],  // address,establishment,geocode
        componentRestrictions: {country: 'in'},
      });

      const autocompleteOutput = new google.maps.places.Autocomplete(this.pickupOutputElementRef.nativeElement, {
        types: [],  // address,establishment,geocode
        componentRestrictions: {country: 'in'},
      });

      this.setupPlaceChangedListener(autocompleteInput, 'ORG');
      this.setupPlaceChangedListener(autocompleteOutput, 'DES');
    });
  }

  private setupPlaceChangedListener(autocomplete: any, mode: any) {
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        // get the place result
        const place: google.maps.places.PlaceResult = autocomplete.getPlace();
        // verify result
        if (place.geometry === undefined) {
          return;
        }
        if (mode === 'ORG') {
          this.vc.origin = {longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat()};
          this.vc.originPlaceId = place.place_id;
        } else {
          this.vc.destination = {
            longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat()
          }; //  its a example aleatory position
          this.vc.destinationPlaceId = place.place_id;
        }

        if (this.vc.directionsDisplay === undefined) {
          this.mapsAPILoader.load().then(() => {
            this.vc.directionsDisplay = new google.maps.DirectionsRenderer;
          });
        }

        // Update the directions
        this.vc.updateDirections();
        this.zoom = 12;
      });

    });

  }

  getDistanceAndDuration() {
    this.estimatedTime = this.vc.estimatedTime;
    this.estimatedDistance = this.vc.estimatedDistance;
  }

  private setPickUpLocation(place: any) {
    // verify result
    if (place.geometry === undefined || place.geometry === null) {
      return;
    }
    // set latitude, longitude and zoom
    this.latitude = place.geometry.location.lat();
    this.longitude = place.geometry.location.lng();
    this.zoom = 12;
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
}
