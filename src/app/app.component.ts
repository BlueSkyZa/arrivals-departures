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
  private board = 'arrival';
  private flight: Array<Flight> = [];

  constructor(private dataService: DataService) {
    this.flight = dataService.getFlight(this.board);
  }

  private select(board: string) {
    if (this.board !== board) {
      this.board = board;
      this.flight = this.dataService.getFlight(board);
    }
  }

  private toggle() {
    this.dataService.running = !this.dataService.running;
  }
}
