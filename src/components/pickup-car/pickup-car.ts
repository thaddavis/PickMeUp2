import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Car } from '../../providers/car';
import { PickupPubSub } from '../../providers/pickup-pub-sub';

import * as SlidingMarker from 'marker-animate-unobtrusive';

declare var google:any

@Component({
  selector: 'pickup-car',
  templateUrl: 'pickup-car.html'
})
export class PickupCarComponent implements OnInit, OnChanges {

  @Input() map: any;
  @Input() isPickupRequested: boolean;
  @Input() pickupLocation: any;

  public pickupCarMarker: any;
  public polylinePath: any;

  constructor(public car:Car, private pickupPubSub: PickupPubSub) {
  }

  ngOnInit() {

  }

  ngOnChanges(x) {
    if (this.isPickupRequested) {
      this.requestCar();
    } else {
      this.removeCar();
      this.removeDirections();
    }
  }

  addCarMarker(position) {
    this.pickupCarMarker = new SlidingMarker({
      map: this.map,
      position: position,
      icon: './assets/img/car.png'
    });

    this.pickupCarMarker.setDuration(2000);
    this.pickupCarMarker.setEasing('linear');
  }

  showDirections(path) {
    this.polylinePath = new google.maps.Polyline({
      path: path,
      strokeColor: '#FF0000',
      strokeWeight: 3
    });

    this.polylinePath.setMap(this.map);
  }

  updateCar(cbDone) {
    this.car.getPickupCar().subscribe(car => {
      // animate car to next point
      this.pickupCarMarker.setPosition(car.position);
      // set direction path for car
      this.polylinePath.setPath(car.path);
      // update arrival time
      this.pickupPubSub.emitArrivalTime(car.time);


      // keep updating car
      if (car.path.length > 1) {
        setTimeout(() => {
          this.updateCar(cbDone);
        }, 100);
      } else {
        // car arrived
        cbDone();
      }
    });
  }

  checkForRiderPickup() {
    this.car.pollForRiderPickup()
      .subscribe( data => {
        this.pickupPubSub.emitPickUp();
      })
  }

  requestCar() {
    this.car.findPickupCar(this.pickupLocation)
      .subscribe(car => {
         //show car marker
         this.addCarMarker(car.position);
         // show car path/directions to you
         this.showDirections(car.path);
         // keep updating car
         this.updateCar(() => this.checkForRiderPickup() );
      });
  }

  removeDirections() {
    if (this.polylinePath) {
      this.polylinePath.setMap(null);
      this.polylinePath = null;
    }
  }

  removeCar() {
    if (this.pickupCarMarker) {
      this.pickupCarMarker.setMap(null);
      this.pickupCarMarker = null;
    }
  }

}
