/**
 * Created by ankur on 21/7/17.
 */
import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {GoogleMapsAPIWrapper} from '@agm/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

declare const google: any;


@Directive({
    selector: 'google-map-hotel'
})
export class HotelMapDirective {
    @Input() lat: any;
    @Input() lang: any;
    public markers: any;
    public MARKER_PATH: string;
    public infoWindow: any;
    public infoWindowContent: any;

    @Output() MarkerClick = new EventEmitter();
    @Output() HotelResult = new EventEmitter();

    constructor(private gmapsApi: GoogleMapsAPIWrapper) {
        this.MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
        this.markers = [];
    }

    updateDirections() {
        this.gmapsApi.getNativeMap().then(map => {
            const latLng = new google.maps.LatLng({lat: this.lat, lng: this.lang});
            const me = this;
            this.infoWindow = new google.maps.InfoWindow({
                content: me.infoWindowContent
            });
            map.panTo(latLng);
            map.setZoom(15);
            const places = new google.maps.places.PlacesService(map);
            const search = {
                bounds: map.getBounds(),
                types: ['lodging']
            };
            places.nearbySearch(search, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    me.clearMarkers();

                    for (let i = 0; i < results.length; i++) {
                        const markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
                        const markerIcon = me.MARKER_PATH + markerLetter + '.png';

                        // Use marker animation to drop the icons incrementally on the map.
                        me.markers[i] = new google.maps.Marker({
                            position: results[i].geometry.location,
                            animation: google.maps.Animation.DROP,
                            icon: markerIcon
                        });

                        me.markers[i].placeResult = results[i];

                        // If the user clicks a hotel marker, show the details of that hotel
                        // in an info window.
                        google.maps.event.addListener(me.markers[i], 'click', () => {
                            const marker = me.markers[i];
                            // Get the place details for a hotel. Show the information in an info window,
                            places.getDetails({placeId: marker.placeResult.place_id},
                                function (place, statusFlag) {
                                    if (statusFlag !== google.maps.places.PlacesServiceStatus.OK) {
                                        return;
                                    }
                                    me.infoWindow.open(map, marker);
                                    const hotelInfo = {
                                        name: place.name,
                                        address: place.vicinity,
                                        phone: place.formatted_phone_number,
                                        website: place.url,
                                        icon: place.icon,
                                        rating: me.getRatingHtml(place)
                                    };
                                    me.MarkerClick.emit(hotelInfo);
                                });
                        });

                        const timer = Observable.timer(i * 100);
                        timer.subscribe(t => {
                            me.markers[i].setMap(map);
                        });
                    }
                    // set the hotel result as output for listing
                    me.HotelResult.emit(me.markers);
                }
            });
        });
    }

    private getRatingHtml(place): string {
        // Assign a five-star rating to the hotel, using a black star ('&#10029;')
        // to indicate the rating the hotel has earned, and a white star ('&#10025;')
        // for the rating points not achieved.
        let ratingHtml = '';
        if (place.rating) {
            for (let j = 0; j < 5; j++) {
                if (place.rating < (j + 0.5)) {
                    ratingHtml += '&#10025;';
                } else {
                    ratingHtml += '&#10029;';
                }
                document.getElementById('iw-rating-row').style.display = '';
                document.getElementById('iw-rating').innerHTML = ratingHtml;
            }
        }
        return ratingHtml;
    }

    private clearMarkers() {
        for (let i = 0; i < this.markers.length; i++) {
            if (this.markers[i]) {
                this.markers[i].setMap(null);
            }
        }
        this.markers = [];
    }
}

export interface Hotel {
    name: string;
    icon: string;
    address: string;
    phone: string;
    website: string;
    rating: string;
}
