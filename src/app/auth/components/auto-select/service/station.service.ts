import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StationData } from '../model';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private readonly apiUrl = '/api/stations';

  constructor(private http: HttpClient) {}

  fetchStations(): Observable<StationData[]> {
    return this.http.get<StationData[]>(this.apiUrl);
  }
}
