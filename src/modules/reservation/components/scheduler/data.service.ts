import {Injectable} from '@angular/core';
import {DayPilot} from 'daypilot-pro-angular';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class DataService {

  resources: DayPilot.ResourceData[] = [
        {chambre: '001', id: 'R1', category: "S",etat:"S"},
        {chambre: '102', id: 'R2', category: "FA",etat:"P"},
        {chambre: '103', id: 'R3', category: "S",etat:"P"},
        {chambre: '104', id: 'R4', category: "FA",etat:"P"},
   
        {chambre: '110', id: 'R5', category: "S",etat:"P"},
        {chambre: '111', id: 'R6', category: "FA",etat:"P"},
        {chambre: '112', id: 'R7', category: "S",etat:"P"},
        {chambre: '113', id: 'R8', category: "FA",etat:"P"},
  ];

  events: DayPilot.EventData[] = [
    {
      id: '1',
      resource: 'R1',
      start: '2023-10-03',
      end: '2023-10-08',
      text: 'Scheduler Event 1',
      barColor: '#e69138'
    },
    {
      id: '2',
      resource: 'R3',
      start: '2023-10-02',
      end: '2023-10-05',
      text: 'Scheduler Event 2',
      barColor: '#6aa84f'
    },
    {
      id: '3',
      resource: 'R3',
      start: '2023-10-06',
      end: '2023-10-09',
      text: 'Scheduler Event 3',
      barColor: '#3c78d8'
    }
  ];

  constructor(private http: HttpClient) {
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString());
  }

  getResources(): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.resources);
      }, 200);
    });

    // return this.http.get("/api/resources");
  }

}
