import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Article } from '../article/article';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { D3chart } from '../d3chart/d3chart';

@Component({
  standalone: true,
  selector: 'pb-homepage',
  imports: [Article, Breadcrumbs, D3chart],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class Homepage implements AfterViewInit {
  public dataSource = {
                datasets: [
                    {
                        data: [] as number[],
                        backgroundColor: [
                            '#ffcd56',
                            '#ff6384',
                            '#36a2eb',
                            '#fd6b19',
                        ]
                    }
                ],
                labels: [] as string[]
            };

  constructor(private http: HttpClient) { 
  }

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        console.log(res.myBudget);
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
    })

  }

  createChart() {
            const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return; // context failed
            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: this.dataSource
            });
        }

}
