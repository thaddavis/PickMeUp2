import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

declare var google:any;

@Injectable()
export class Simulate {

  public directionsService: any;
  public myRoute: any;
  public myRouteIndex: number;

  constructor(public http: Http) {
    this.directionsService = new google.maps.DirectionsService();
  }

  riderPickedUp() {
    // simulate rider picked up after 1 second
    return Observable.timer(1000);
  }

  riderDroppedOff() {
    // simulate rider dropped off after 1 second
    return Observable.timer(1000);
  }

  //ngOnInit() {
  //  this.directionsService = new google.maps.DirectionsService();
  //  console.log(this.directionsService);
  //}

  getPickupCar() {
    return Observable.create(observable => {
      let car = this.myRoute[this.myRouteIndex];
      observable.next(car);
      this.myRouteIndex++;
    })
  }

  getSegmentedDirections(directions) {
    let route = directions.routes[0];
    let legs = route.legs;
    let path = [];
    let increments = [];
    let duration = 0;

    let numOfLegs = legs.length;

    while (numOfLegs--) {
      let leg = legs[numOfLegs];
      let steps = leg.steps;
      let numOfSteps = steps.length;

      while (numOfSteps--) {
        let step = steps[numOfSteps];
        let points = step.path;
        let numOfPoints = points.length;

        duration += step.duration.value;

        while (numOfPoints--) {
          let point = points[numOfPoints];

          path.push(point);
          increments.unshift({
            position: point,
            time: duration,
            path: path.slice(0)
          })
        }
      }
    }

    return increments;
  }

  calculateRoute(start, end) {

    return Observable.create(observable => {

      this.directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          observable.next(response);
        }
        else {
          observable.error(status);
        }
      })
    });
  }

  simulateRoute(start, end) {
    return Observable.create(observable => {
      this.calculateRoute(start, end).subscribe(directions =>  {
        // getRoutePath
        this.myRoute = this.getSegmentedDirections(directions);
        // return pickupCar
        this.getPickupCar().subscribe(car => {
          observable.next(car);
        })
      })
    })
  }

  findPickupCar(pickupLocation) {
    this.myRouteIndex = 0;

    let car = this.cars1.cars[0];
    let start = new google.maps.LatLng(car.coord.lat, car.coord.lng);
    let end = pickupLocation;

    return this.simulateRoute(start,end);
  }

  getCars(lat, lng) {
    let carData = this.cars[this.carIndex];
    this.carIndex++;

    if (this.carIndex > this.cars.length-1) {
      this.carIndex = 0;
    }

    return Observable.create(
      observer => observer.next(carData)
    )
  }

  private carIndex: number = 0;

  private cars1 =  {
    cars: [
      {
        id: 1,
        coord: {
          lat: 25.778458,
          lng: -80.133398
        }
      },
      {
        id: 2,
        coord: {
          lat: 25.792099,
          lng: -80.143611
        }
      }
    ]
  }

  private cars2 =  {
    cars: [
      {
        id: 1,
        coord: {
          lat: 25.780468,
          lng: -80.132861
        }
      },
      {
        id: 2,
        coord: {
          lat: 25.792846,
          lng: -80.142260
        }
      }
    ]
  }

  private cars3 =  {
    cars: [
      {
        id: 1,
        coord: {
          lat: 25.782574,
          lng: -80.132453
        }
      },
      {
        id: 2,
        coord: {
          lat: 25.79354,
          lng: -80.141058
        }
      }
    ]
  }

  private cars4 =  {
    cars: [
      {
        id: 1,
        coord: {
          lat: 25.786109,
          lng: -80.131831
        }
      },
      {
        id: 2,
        coord: {
          lat: 25.794430,
          lng: -80.139170
        }
      }
    ]
  }

  private cars5 =  {
    cars: [
      {
        id: 1,
        coord: {
          lat: 25.790785,
          lng: -80.131874
        }
      },
      {
        id: 2,
        coord: {
          lat: 25.795550,
          lng: -80.137367
        }
      }
    ]
  }

  private cars = [
    this.cars1,
    this.cars2,
    this.cars3,
    this.cars4,
    this.cars5
  ];

}
