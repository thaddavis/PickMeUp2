import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PickupPubSub } from '../../providers/pickup-pub-sub';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  public isPickupRequested: boolean;
  public isRiderPickedUp: boolean;
  public timeTillArrival: number;
  public pickupSubscription: any;

  constructor(
    public navCtrl: NavController,
    private pickupPubSub: PickupPubSub
  ) {
    this.isRiderPickedUp = false;
    this.timeTillArrival = 5;
    this.isPickupRequested = false;
    this.pickupSubscription = this.pickupPubSub
      .watch()
      .subscribe( e => {
        this.processPickupSubscription(e);
      })
  }

  processPickupSubscription(e) {
    switch(e.event) {
      case this.pickupPubSub.EVENTS.ARRIVAL_TIME:
        this.updateArrivalTime(e.data);
        break;
      case this.pickupPubSub.EVENTS.DROPOFF:
        ;
      case this.pickupPubSub.EVENTS.PICKUP:
        this.riderPickedUp();
        break;
    }
  }

  riderPickedUp() {
    this.isRiderPickedUp = true;
  }

  updateArrivalTime(seconds) {
    let minutes = Math.floor(seconds/60);
    this.timeTillArrival = minutes;
  }

  ngOnInit() {
    this.isPickupRequested = false;
  }

  confirmPickup() {
    this.isPickupRequested = true;
  }

  cancelPickup() {
    this.isPickupRequested = false;
  }

}
