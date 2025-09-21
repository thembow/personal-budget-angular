import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface ChartItem {
  label: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private chartData: ChartItem[] | null = null;
  private readonly url = 'http://localhost:3000/budget';

  constructor(private http: HttpClient) {}

  /** Returns cached chart-friendly data */
  getBudgetData(): Observable<ChartItem[]> {
    if (this.chartData) {
      return of(this.chartData);
    }

    return this.http.get<{ myBudget: { title: string; budget: number }[] }>(this.url)
      .pipe(
        map(res =>
          // transform API shape → chart shape
          res.myBudget.map(item => ({
            label: item.title,
            value: item.budget
          }))
        ),
        tap(transformed => this.chartData = transformed) // cache
      );
  }

  clearCache() {
    this.chartData = null;
  }
}
