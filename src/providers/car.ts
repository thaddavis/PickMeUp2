import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Simulate } from './simulate';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
 import 'rxjs/add/operator/switchMap';
 import 'rxjs/add/operator/share';

@Injectable()
export class Car {

  constructor(public http: Http, public simulate: Simulate) {}

  getPickupCar() {
    return this.simulate.getPickupCar();
  }

  findPickupCar(pickupLocation) {
    return this.simulate.findPickupCar(pickupLocation);
  }

  getCars(lat, lng) {
    return Observable
      .interval(2000)
      .switchMap(
      () => this.simulate.getCars(lat,lng))
      .share();
  }

}
