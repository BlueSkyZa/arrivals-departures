import { Component } from '@angular/core';

import { DataService } from './data.service';

interface Flight {
  airport: string;
  airline: string;
  flight: string;
  scheduled: string;
  estimated: string;
  status: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private type = 'arrival';
  private flight: Array<Flight> = [];

  constructor(private dataService: DataService) {
    this.flight = dataService.getFlight(this.type);
  }

  private select(type: string) {
    if (this.type !== type) {
      this.type = type;
      this.flight = this.dataService.getFlight(type);
    }
  }

  private toggle() {
    this.dataService.running = !this.dataService.running;
  }
}
