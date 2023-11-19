import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  Observable,
  Subscription,
  catchError,
  switchMap,
  timer,
  EMPTY,
} from 'rxjs';
import { CpuUsage } from 'models';
import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // Use 'styleUrls' instead of 'styleUrl'
})
export class DashboardComponent {
  latestUserCpuUsage: string = '';
  latestUserTimestamp: string = '';
  userLastHourAvgUsage: string = '';
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

  private getFormattedTime(timestamp: number): string {
    return moment(timestamp).format('HH:mm:ss');
  }
}
