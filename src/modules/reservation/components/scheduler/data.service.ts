import { Injectable } from '@angular/core';
import {DayPilot} from 'daypilot-pro-angular';
import {Router} from "@angular/router";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class DataService {

  error: any | undefined;
  user: any;
  

  constructor(private http : HttpClient, private router: Router){
  }

  getUser(): Observable<any> {
    return this.http.post("/api/backend_user.php", {}).pipe(map((response:any) => {
      this.user = response.user;
      return response;
    }));
  }

  doLogin(user:{username: string, password: string}): Observable<any> {
    return this.http.post("/api/backend_user.php", user);
  }

  isLoggedIn() {
    return !!localStorage.getItem("user");
  }

  logout() {
    localStorage.removeItem("user");
    this.router.navigate(["/login"]);
  }

  getReservations(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {
    return this.http.post("/api/backend_reservations.php", {start: from.toString(), end: to.toString()}) as Observable<any>;
  }

  createReservation(data: CreateReservationParams): Observable<ReservationData> {
    return this.http.post("/api/backend_reservation_create.php", data).pipe(map((response:any) => {
      return {
        id: response.id,
        start: data.start,
        end: data.end,
        resource: data.room,
        text: data.name,
        status: "New",
        paid: "0"
      };
    }));
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.post("/api/backend_reservation_delete.php", {id: id});
  }

  updateReservation(params: UpdateReservationParams): Observable<ReservationData> {
    return this.http.post("/api/backend_reservation_update.php", params).pipe(map((response:any) => {
      return params;
    }));
  }

  moveReservation(params: MoveReservationParams): Observable<any> {
    return this.http.post("/api/backend_reservation_move.php", params);
  }

  getRooms(): Observable<any[]> {
    const url = "http://localhost:1337/api/rooms";
    const opts = { params: { populate: "*" } };
    return this.http.get<Response>(url, opts).pipe(
      catchError((error) => this.handleError(error)),
      map((response:any) => response.data.map((x:any) => x.attributes))
    );
  }

  createRoom(params: CreateRoomParams): Observable<RoomData> {
    return this.http.post("/api/backend_room_create.php", params).pipe(map((response:any) => {
      return {
        name: params.name,
        capacity: params.capacity,
        status: "Ready",
        id: response.id,
      };
    }));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error;
    return of();
  }

  updateRoom(params: UpdateRoomParams): Observable<RoomData> {
    return this.http.post("/api/backend_room_update.php", params).pipe(map((response:any) => {
      return {
        id: params.id,
        name: params.name,
        capacity: params.capacity,
        status: params.status
      };
    }));
  }

  deleteRoom(id: string): Observable<any> {
    return this.http.post("/api/backend_room_delete.php", {id: id});
  }

}


export interface CreateReservationParams {
  start: string;
  end: string;
  name: string;
  room: string | number;
}

export interface UpdateReservationParams {
  id: string;
  start: DayPilot.Date;
  end: DayPilot.Date;
  resource: string;
  text: string;
  status: string;
  paid: number | string;
}


export interface MoveReservationParams {
  id: string;
  start: DayPilot.Date;
  end: DayPilot.Date;
  room: string;
}

export interface CreateRoomParams {
  name: string;
  capacity: number;
}

export interface UpdateRoomParams {
  id: string;
  name: string;
  capacity: number;
  status: string;
}

export interface ReservationData {
  id: string | number;
  start: string | DayPilot.Date;
  end: string | DayPilot.Date;
  text: string;
  resource: string | number;
  status: string;
  paid: number | string;
}

export interface RoomData {
  id: string;
  name: string;
  capacity: number;
  status: string;
}
