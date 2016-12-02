import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { PickupPubSub } from '../../providers/pickup-pub-sub';
import { Observable } from 'rxjs/Observable';

declare var google:any;

@Component({
  selector: 'pickup',
  templateUrl: 'pickup.html'
})
export class PickupComponent implements OnInit, OnChanges {

  @Input() isPinSet: boolean;
  @Input() map: any;
  @Input() isPickupRequested: boolean;
  @Output() updatedPickupLocation: EventEmitter<any> = new EventEmitter<any>();

  private pickupMarker: any;
  private popup: any;
  private pickupSubscription: any;

  constructor(private pickupPubSub: PickupPubSub) {}

  ngOnInit() {
    this.pickupSubscription = this.pickupPubSub.watch().subscribe(e => {
      if (e.event === this.pickupPubSub.EVENTS.ARRIVAL_TIME) {
        this.updateTime(e.data);
      }
    })
  }

  ngOnChanges(changes) {

    if (!this.isPickupRequested) {
      if (this.isPinSet) {
        this.showPickupMarker();
      } else {
        this.removePickupMarker();
      }
    }
  }

  showPickupMarker() {

    this.removePickupMarker();

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

    // send pickup location
    this.updatedPickupLocation.next(this.pickupMarker.getPosition());
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

  updateTime(seconds) {
    let minutes = Math.floor(seconds/60);
    this.popup.setContent(`<h5>${minutes} minutes</h5>`);
  }

}

