import { Component, Input, OnChanges } from '@angular/core';

declare var google:any;

@Component({
  selector: 'pickup',
  templateUrl: 'pickup.html'
})
export class PickupComponent implements OnChanges {

  @Input() isPinSet: boolean;
  @Input() map: any;

  private pickupMarker: any;
  private popup: any;

  constructor() {}

  ngOnChanges(changes) {

    if (this.isPinSet) {
      this.showPickupMarker();
    } else {
      this.removePickupMarker();
    }
  }

  showPickupMarker() {
    this.pickupMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.BOUNCE,
      position: this.map.getCenter(),
      icon: './assets/img/person-icon.png'
    })

    setTimeout( () => {
      if (this.pickupMarker) {
        this.pickupMarker.setAnimation(null);
      }
    }, 750);

    this.showPickupTime();
  }

  removePickupMarker() {
    if (this.pickupMarker) {
      this.pickupMarker.setMap(null);
      this.pickupMarker = null;
    }
  }

  showPickupTime() {
    this.popup = new google.maps.InfoWindow({
      content: '<h5>You are here</h5>'
    });

    this.popup.open(this.map, this.pickupMarker);

    google.maps.event.addListener(this.pickupMarker, 'click', () => {
      this.popup.open(this.map, this.pickupMarker);
    });
  }

}

