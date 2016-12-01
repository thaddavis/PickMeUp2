import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Car } from '../../providers/car';

import * as SlidingMarker from 'marker-animate-unobtrusive';

declare var google:any;

@Component({
  selector: 'available-cars',
  templateUrl: 'available-cars.html'
})
export class AvailableCarsComponent implements OnInit, OnChanges  {

  @Input() map: any;
  @Input() isPickupRequested: boolean;

  public carMarkers: Array<any>;

  constructor(public car: Car) {
  }

  ngOnInit() {
    this.carMarkers = [];
    this.fetchAndRefreshCars();
  }

  ngOnChanges(x) {
    if(this.isPickupRequested) {
      this.removeCarMarkers();
    }
  }

  removeCarMarkers() {
     let numOfCars = this.carMarkers.length;
     while(numOfCars--) {
       let car = this.carMarkers.pop();
       car.setMap(null);
     }
  }

  addCarMarker(car) {
    //let carMarker = new google.maps.Marker({
    let carMarker = new SlidingMarker({
      map: this.map,
      position: new google.maps.LatLng(car.coord.lat, car.coord.lng),
      icon: './assets/img/car.png'
    });

    carMarker.setDuration(2000);
    carMarker.setEasing('linear');
    carMarker.set('id', car.id);

    this.carMarkers.push(carMarker);
  }

  updateCarMarker(car) {
    for (var i=0, numOfCars=this.carMarkers.length; i < numOfCars; i++) {
      // find car and update it
      if ((<any>this.carMarkers[i]).id === (<any>car).id) {
        this.carMarkers[i].setPosition(new google.maps.LatLng(car.coord.lat, car.coord.lng));
        return;
      }

    }

    this.addCarMarker(car);
  }

  fetchAndRefreshCars() {
    this.car.getCars(9,9)
      .subscribe(carsData => {
        if (!this.isPickupRequested) {
          (<any>carsData).cars.forEach( car =>  {
            this.updateCarMarker(car);
          })
        }
      });
  }

}
