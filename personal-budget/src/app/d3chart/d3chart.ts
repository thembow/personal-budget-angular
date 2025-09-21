import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data'; // adjust path to where your service is

@Component({
  selector: 'pb-d3chart',
  standalone: true,
  imports: [],
  templateUrl: './d3chart.html',
  styleUrls: ['./d3chart.scss']
})
export class D3chart implements OnInit {
  private svg: any;
  private width = 450;
  private height = 450;
  private radius = Math.min(this.width, this.height) / 2;

  private color = d3.scaleOrdinal(d3.schemeCategory10);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.createSvg();

    // call your service (adjust method name)
    this.dataService.getBudgetData().subscribe(data => {
  // data is already ChartItem[]
  this.drawChart(data);
  });
  }

  private createSvg(): void {
    this.svg = d3.select('#chart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
  }

  private drawChart(data: any[]): void {
    const pie = d3.pie<any>().value(d => d.value);
    const arc = d3.arc<any>().innerRadius(0).outerRadius(this.radius * 0.8);
    const outerArc = d3.arc<any>().innerRadius(this.radius * 0.9).outerRadius(this.radius * 0.9);

    // clear before redrawing
    this.svg.selectAll('*').remove();
    this.svg.attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

    const pieData = pie(data);

    this.svg.selectAll('path.slice')
      .data(pieData)
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('d', arc)
      .attr('fill', (d, i) => this.color(i));

    this.svg.selectAll('text')
      .data(pieData)
      .enter()
      .append('text')
      .text(d => d.data.label)
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        pos[0] = this.radius * 0.95 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', d => this.midAngle(d) < Math.PI ? 'start' : 'end');

    this.svg.selectAll('polyline')
      .data(pieData)
      .enter()
      .append('polyline')
      .attr('points', d => {
        const pos = outerArc.centroid(d);
        pos[0] = this.radius * 0.95 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });
  }

  private midAngle(d: any): number {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
}