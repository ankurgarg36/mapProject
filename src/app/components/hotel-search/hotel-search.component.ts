import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {GoogleMapsAPIWrapper, MapsAPILoader} from '@agm/core';
import {Hotel, HotelMapDirective, MapConst} from '../../directives/google-map-hotel.directive';
import {DirectionsMapDirective} from '../../directives/google-map.directive';

declare const google: any;
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
    @ViewChild(HotelMapDirective) vc: HotelMapDirective;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    @ViewChild('infowindowcontent')
    public infowindowcontentElementRef: ElementRef;

    public hotel: Hotel;
    public hotels: any;
    public currentPlaceId: string;

    @ViewChild(DirectionsMapDirective) vcd: DirectionsMapDirective;

    public origin: any; //  its a example aleatory position
    public destination: any; //  its a example aleatory position

    constructor(private mapsAPILoader: MapsAPILoader,
                private ngZone: NgZone) {
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
                console.log(this.latitude);
                console.log(this.longitude);
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
            const me = this;
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    me.currentPlaceId = results[1].place_id;
                }
            }
        });
    }
    getDirection = (hotel: Hotel): void => {
        this.mapsAPILoader.load().then(() => {
            this.ngZone.run(() => {
                this.vcd.destination = {
                    longitude: hotel.longitude, latitude: hotel.latitude
                };

                this.vcd.destinationPlaceId = hotel.placeId;
                this.vcd.origin = {longitude: this.longitude, latitude: this.latitude};
                this.vcd.originPlaceId = this.currentPlaceId;
                if (this.vcd.directionsDisplay === undefined) {
                    this.mapsAPILoader.load().then(() => {
                        this.vcd.directionsDisplay = new google.maps.DirectionsRenderer;
                    });
                }

                // Update the directions
                this.vcd.updateDirections();
                this.zoom = 12;
            });
        });
    }
}

