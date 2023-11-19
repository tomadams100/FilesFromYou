import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  Observable,
  Subscription,
  catchError,
  switchMap,
  timer,
  EMPTY,
  tap,
} from 'rxjs';
import { CpuUsage, User } from 'models';
import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  latestUserCpuUsage: string = '';
  latestUserTimestamp: string = '';
  userLastHourAvgUsage: string = '';
  usersWithAboveAvgUsage: Array<{ user: User; userAvg: number }> | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.subscription = timer(0, 5000)
      .pipe(
        switchMap(() => {
          return this.fetchData();
        })
      )
      .subscribe();
    this.subscription = timer(0, 5000)
      .pipe(
        switchMap(() => {
          return this.fetchLastHourAvg();
        })
      )
      .subscribe();
    this.subscription = timer(0, 5000)
      .pipe(
        switchMap(() => {
          return this.fetchUsersWithAboveAvgUsage();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchData(): Observable<CpuUsage> {
    return this.http.get<CpuUsage>('http://localhost:8080/cpu-usage').pipe(
      catchError((error: any) => {
        console.error('Error fetching CPU usage data:', error);
        return EMPTY;
      }),
      switchMap((data: CpuUsage) => {
        this.latestUserCpuUsage = data.usage.toFixed(2);
        this.latestUserTimestamp = this.getFormattedTime(data.timestamp);
        return EMPTY;
      })
    );
  }

  private fetchLastHourAvg(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/last-hour-avg').pipe(
      catchError((error: any) => {
        console.error('Error fetching last hour average:', error);
        return EMPTY;
      }),
      switchMap((avg: number) => {
        this.userLastHourAvgUsage = avg.toFixed(2);
        return EMPTY;
      })
    );
  }

  private fetchUsersWithAboveAvgUsage(): Observable<Array<{
    user: User;
    userAvg: number;
  }> | null> {
    return this.http
      .get<Array<{ user: User; userAvg: number }> | null>(
        'http://localhost:8080/above-avg-usage-users'
      )
      .pipe(
        catchError((error: any) => {
          console.error(
            'Error fetching users with above average usage:',
            error
          );
          return EMPTY;
        }),
        tap((data: Array<{ user: User; userAvg: number }> | null | null) => {
          if (data) {
            console.log('data', data);
            this.usersWithAboveAvgUsage = data;
          }
        })
      );
  }

  private getFormattedTime(timestamp: number): string {
    return moment(timestamp).format('HH:mm:ss');
  }
}
