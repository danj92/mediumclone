import { Component, OnInit } from '@angular/core';
import { StationService } from './auth/components/auto-select/service/station.service';
import { StationData } from './auth/components/auto-select/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  allStations: StationData[];
  constructor(private stationService: StationService) {}

  ngOnInit(): void {
    this.stationService.fetchStations().subscribe((stations) => {
      this.allStations = stations;
    });
  }

  selectedStation: string | null = null;

  onStationSelected(station: string): void {
    this.selectedStation = station;
  }
}
