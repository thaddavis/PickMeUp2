import { Component, OnInit, Input } from '@angular/core';

declare var google:any;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit {

  @Input() isPickupRequested: boolean;
  public map: any;

  constructor() {}

  ngOnInit() {
    this.map = this.createMap();
  }

  createMap(location = new google.maps.LatLng(40.7127, -74.0059)) {
    let mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }

    let mapEl = document.getElementById('map');
    let map =  new google.maps.Map(mapEl, mapOptions);

    return map;
  }

}
