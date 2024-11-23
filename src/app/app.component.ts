import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StationService } from './auth/components/auto-select/service/station.service';
import { StationData } from './auth/components/auto-select/station-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  allStations$: Observable<StationData[]> = this.stationService.fetchStations();
  constructor(private stationService: StationService) {}
}
