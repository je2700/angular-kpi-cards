import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

export interface KpiData {
  title: string;
  value: number | string;
  previousValue?: number;
  target?: number;
  unit?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercentage?: number;
  color?: string;
  chartData?: number[];
  chartLabels?: string[];
  type?: 'metric' | 'progress' | 'chart' | 'comparison';
  description?: string;
  isPercentage?: boolean;
}

@Component({
  selector: 'app-kpi-card',
  imports: [CommonModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss'
})
export class KpiCardComponent implements OnInit, AfterViewInit {
  @Input() data!: KpiData;
  @Input() cardType: 'default' | 'compact' | 'detailed' | 'chart' = 'default';
  @Input() theme: 'light' | 'dark' | 'gradient' = 'light';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart?: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    // Initialize component
  }

  ngAfterViewInit() {
    if (this.data.chartData && this.chartCanvas) {
      this.createChart();
    }
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: this.getChartType(),
      data: {
        labels: this.data.chartLabels || [],
        datasets: [{
          data: this.data.chartData || [],
          backgroundColor: this.getChartColors(),
          borderColor: this.data.color || '#4F46E5',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        },
        elements: {
          point: {
            radius: 0
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private getChartType(): ChartType {
    if (this.data.type === 'chart') {
      return 'line';
    }
    return 'line';
  }

  private getChartColors(): string | string[] {
    const baseColor = this.data.color || '#4F46E5';
    return `${baseColor}20`; // 20% opacity
  }

  getTrendIcon(): string {
    switch (this.data.trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  }

  getTrendClass(): string {
    switch (this.data.trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      default: return 'trend-neutral';
    }
  }

  getProgressPercentage(): number {
    if (this.data.target && typeof this.data.value === 'number') {
      return Math.min((this.data.value / this.data.target) * 100, 100);
    }
    return 0;
  }

  formatValue(value: number | string): string {
    if (typeof value === 'string') return value;
    
    if (this.data.isPercentage) {
      return `${value}%`;
    }
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    
    return value.toLocaleString();
  }
}
