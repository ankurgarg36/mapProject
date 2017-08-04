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

    public estimatedTime: any;
    public estimatedDistance: any;
    public mapClass = 'col-md-12';

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
                this.estimatedTime = null;
                this.estimatedDistance = null;
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

    /**
     * getting the lat, long from your current position
     */
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

    /**
     * getting the information of particular hotel to for display in pop up
     * @param hotel
     * @constructor
     */
    MarkerClickHandler(hotel: Hotel) {
        this.ngZone.run(() => {
            this.hotel = hotel;
        });
    }

    /**
     * get all the hotels after the search. It is used for listing
     * @param hotels
     * @constructor
     */
    HotelResultHandler(hotels: any) {
        this.mapClass = 'col-md-9'
        this.ngZone.run(() => {
            this.hotels = hotels;
        });
    }

    /**
     * getting the url of hotel icon. it is different for every hotel
     * @param index
     * @returns {string}
     */
    getIcon = (index: any): string => {
        const markerLetter = String.fromCharCode('A'.charCodeAt(0) + (index % 26));
        return MapConst.MARKER_PATH + markerLetter + '.png';
    }

    /**
     * firing the click event when user click on any hotel displyed in the list
     * @param obj
     */
    triggerClick = (obj: any): void => {
        google.maps.event.trigger(obj, 'click');
        window.scrollTo(0, 0);
    }

    /**
     * setting the place id from your current location. this will be used as a origin
     */
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

    /**
     * getting the direction between the hotel and your current position
     * @param hotel it's a destination
     */
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

    /**
     * updating the distance and time for a particular hotel
     * @param result
     */
    DirectionResultHandler = (result: any): void => {
        this.estimatedDistance = result.estimatedDistance;
        this.estimatedTime = result.estimatedTime;
        this.vc.infoWindow.close();
    }
}

