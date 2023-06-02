import {Injectable} from '@angular/core';
import {DayPilot} from 'daypilot-pro-angular';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class DataService {

  resources: DayPilot.ResourceData[] = [
    {
      name: 'Group A', id: 'GA', expanded: true, children: [
        {name: 'Resource 1', id: 'R1', capacity: 10},
        {name: 'Resource 2', id: 'R2', capacity: 30},
        {name: 'Resource 3', id: 'R3', capacity: 20},
        {name: 'Resource 4', id: 'R4', capacity: 40}
      ]
    },
    {
      name: 'Group B', id: 'GB', expanded: true, children: [
        {name: 'Resource 5', id: 'R5', capacity: 20},
        {name: 'Resource 6', id: 'R6', capacity: 40},
        {name: 'Resource 7', id: 'R7', capacity: 20},
        {name: 'Resource 8', id: 'R8', capacity: 40}
      ]
    }
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
