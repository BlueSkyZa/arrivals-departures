import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private flight = {
    arrival: null,
    departure: null
  };

  // System time which is accelerated
  private _currentTime: moment.Moment = null;
  get currentTime(): moment.Moment {
    return this._currentTime;
  }

  // Data is updated every 5 seconds and the current time advanced 5 minutes
  private interval = null;
  private _running = false;
  get running(): boolean {
    return this._running;
  }
  set running(value: boolean) {
    this._running = value;

    if (this._running && !this.interval)
      this.interval = setInterval(() => {
        if (!this.currentTime) return;
        this._currentTime = moment(this.currentTime.add(5, 'minute')); // accelerating time, 5 minute every 5 seconds

        if (this.flight.arrival) this.updateFlight('arrival');
        if (this.flight.departure) this.updateFlight('departure');
      }, 5000);

    else if (!this._running && this.interval){
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  // Airport names used to generate data.
  private airport = ['Dublin', 'Amsterdam', 'Bodrum', 'Malaga', 'Inverness', 'Paphos', 'Beziers', 'Nice', 'Limoges', 'Bergerac',
    'Basel', 'Berlin', 'Rome', 'Cologne', 'Edinburgh', 'Isle of Man', 'Glasgow', 'Belfast Intl', 'Paris CDG', 'Geneva', 'Newcastle'];

  // Airline names and codes used to generate data.
  private airline = [{name: 'Aer Lingus', code: 'EI'}, {name: 'Ryanair', code: 'FR'}, {name: 'Klm', code: 'KL'},
    {name: 'Thomascook', code: 'MT'}, {name: 'easyJet', code: 'EZY'}, {name: 'Loganair', code: 'LM'}];

  constructor() {
    this.running = true;
  }

  // Update the flight status
  private updateFlight(type) {
    let newFlights = 0;

    for (let index = this.flight[type].length - 1; index > -1; index--) {
      const
        flight = this.flight[type][index],
        diff = moment(flight.estimated).diff(this._currentTime, 'minute');

      if (type === 'arrival') {
        if (diff >= -10 && diff <= 0)
          flight.status = 'Landed';

        else if (diff < -10 ) {
          this.flight[type].splice(index, 1);
          newFlights++;
        }
      }
      else
        if (diff >= -10 && diff <= 0)
          flight.status = 'Departed';

        else if (diff >= 0 && diff < 10)
          flight.status = 'Gate Closed';

        else if (diff >= 10 && diff < 20)
          flight.status = 'Final Boarding';

        else if (diff >= 20 && diff < 40)
          flight.status = 'Boarding';

        else if (diff >= 50 && diff < 40)
          flight.status = 'Go to Departures';

        else if (diff < -10 ) {
          this.flight[type].splice(index, 1);
          newFlights++;
        }
    }

    const
      length = this.flight[type].length,
      scheduled = length > 0 ? moment(this.flight[type][length - 1].scheduled) : moment(this.currentTime);

    for (let index = 0; index < newFlights; index++) {
      const random = Math.floor((Math.random() * 20) + 5);
      scheduled.add(random, 'minute');
      this.newFlight(type, scheduled);
    }
  }

  // Generate a new flight
  private newFlight(type, scheduled) {
    let
      random = Math.floor(Math.random() * 10),
      status = '',
      estimated = null;

    // Random airline
    const airline = this.airline[Math.floor(Math.random() * this.airline.length)];

    // Randomize estimated time
    if (random > 7) {
      if (type === 'arrival') random = Math.floor(Math.random() * 10) - 5;
      else random = Math.floor(Math.random() * 10);

      if (random === 0) {
        estimated = scheduled;
        status = '';
      }
      else {
        random = random * 5;
        estimated = moment(scheduled).add(random, 'minute');
        status = random > 0 ? 'Delayed' : 'Early';
      }
    }
    else {
      estimated = scheduled;
      status = '';
    }

    // Add new flight
    this.flight[type].push({
      airport: this.airport[Math.floor(Math.random() * this.airport.length)],
      airline: airline.name,
      flight: airline.code + ' ' + Math.floor(1000 + Math.random() * 9000),
      scheduled: scheduled.toISOString(),
      estimated: estimated.toISOString(),
      status
    });
  }

  // Generate random flight data
  public getFlight(type: string) {
    if (this.flight[type]) return this.flight[type];
    if (!this.currentTime) this._currentTime = moment();

    this.flight[type] = [];

    const scheduled = moment();

    // Generate 15 random flights
    for (let index = 0; index < 15; index++) {
      const random = Math.floor((Math.random() * 10) + 5);
      scheduled.add(random, 'minute');
      this.newFlight(type, scheduled);
    }

    this.updateFlight(type);

    return this.flight[type];
  }
}
