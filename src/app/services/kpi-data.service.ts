import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { KpiData } from '../components/kpi-card/kpi-card';

@Injectable({
  providedIn: 'root'
})
export class KpiDataService {
  private kpiDataSubject = new BehaviorSubject<KpiData[]>([]);
  public kpiData$ = this.kpiDataSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    const mockData: KpiData[] = [
      {
        title: 'Gesamtumsatz',
        value: 2547890,
        previousValue: 2234567,
        unit: '€',
        icon: '$',
        trend: 'up',
        trendPercentage: 14.2,
        color: '#10B981',
        type: 'comparison',
        description: 'Monatlicher Gesamtumsatz',
        chartData: [1800000, 1950000, 2100000, 2234567, 2547890],
        chartLabels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai']
      },
      {
        title: 'Neue Kunden',
        value: 1247,
        target: 1500,
        unit: '',
        icon: '👤',
        trend: 'up',
        trendPercentage: 8.5,
        color: '#3B82F6',
        type: 'progress',
        description: 'Diesen Monat gewonnen'
      },
      {
        title: 'Conversion Rate',
        value: 3.42,
        previousValue: 3.18,
        unit: '%',
        icon: '↗',
        trend: 'up',
        trendPercentage: 7.5,
        color: '#8B5CF6',
        type: 'metric',
        description: 'Website zu Verkauf',
        isPercentage: true
      },
      {
        title: 'Aktive Benutzer',
        value: 45678,
        previousValue: 42341,
        unit: '',
        icon: '⚡',
        trend: 'up',
        trendPercentage: 7.9,
        color: '#F59E0B',
        type: 'chart',
        description: 'Letzte 30 Tage',
        chartData: [38000, 39500, 41200, 42341, 45678],
        chartLabels: ['Woche 1', 'Woche 2', 'Woche 3', 'Woche 4', 'Woche 5']
      },
      {
        title: 'Durchschn. Bestellwert',
        value: 156.78,
        previousValue: 143.22,
        unit: '€',
        icon: '💳',
        trend: 'up',
        trendPercentage: 9.5,
        color: '#EF4444',
        type: 'comparison',
        description: 'Pro Bestellung'
      },
      {
        title: 'Kundenzufriedenheit',
        value: 4.8,
        target: 5.0,
        unit: '/5',
        icon: '★',
        trend: 'up',
        trendPercentage: 2.1,
        color: '#F97316',
        type: 'progress',
        description: 'Durchschnittliche Bewertung'
      },
      {
        title: 'Marketingkosten',
        value: 45230,
        previousValue: 52100,
        unit: '€',
        icon: '📊',
        trend: 'down',
        trendPercentage: 13.2,
        color: '#06B6D4',
        type: 'comparison',
        description: 'Diesen Monat ausgegeben'
      },
      {
        title: 'ROI Marketing',
        value: 340,
        previousValue: 285,
        unit: '%',
        icon: '🎯',
        trend: 'up',
        trendPercentage: 19.3,
        color: '#84CC16',
        type: 'metric',
        description: 'Return on Investment',
        isPercentage: true
      },
      {
        title: 'Webseitenbesucher',
        value: 89456,
        previousValue: 76234,
        unit: '',
        icon: '🌐',
        trend: 'up',
        trendPercentage: 17.3,
        color: '#6366F1',
        type: 'chart',
        description: 'Unique Visitors',
        chartData: [65000, 68500, 72100, 76234, 89456],
        chartLabels: ['Woche 1', 'Woche 2', 'Woche 3', 'Woche 4', 'Woche 5']
      },
      {
        title: 'Lagerbestand',
        value: 87,
        target: 100,
        unit: '%',
        icon: '📦',
        trend: 'down',
        trendPercentage: 5.2,
        color: '#DC2626',
        type: 'progress',
        description: 'Verfügbare Produkte',
        isPercentage: true
      },
      {
        title: 'Support Tickets',
        value: 23,
        previousValue: 31,
        unit: '',
        icon: '🎧',
        trend: 'down',
        trendPercentage: 25.8,
        color: '#059669',
        type: 'comparison',
        description: 'Offene Tickets'
      },
      {
        title: 'Social Media Reach',
        value: 234567,
        previousValue: 198234,
        unit: '',
        icon: '📱',
        trend: 'up',
        trendPercentage: 18.3,
        color: '#8B5CF6',
        type: 'chart',
        description: 'Erreichte Personen',
        chartData: [180000, 185000, 192000, 198234, 234567],
        chartLabels: ['Woche 1', 'Woche 2', 'Woche 3', 'Woche 4', 'Woche 5']
      }
    ];
    
    this.kpiDataSubject.next(mockData);
  }

  getKpiData(): Observable<KpiData[]> {
    return this.kpiData$;
  }

  getKpiById(id: string): Observable<KpiData | undefined> {
    return of(this.kpiDataSubject.value.find(kpi => kpi.title === id));
  }

  updateKpiData(updatedData: KpiData[]): void {
    this.kpiDataSubject.next(updatedData);
  }

  // Simulate real-time data updates
  simulateRealTimeUpdates(): void {
    setInterval(() => {
      const currentData = this.kpiDataSubject.value;
      const updatedData = currentData.map(kpi => {
        // Add some random variation to simulate real data
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        if (typeof kpi.value === 'number') {
          const newValue = Math.max(0, kpi.value * (1 + variation));
          return {
            ...kpi,
            previousValue: kpi.value,
            value: Math.round(newValue * 100) / 100
          };
        }
        return kpi;
      });
      this.kpiDataSubject.next(updatedData);
    }, 30000); // Update every 30 seconds
  }

  // Filter KPIs by type
  getKpisByType(type: string): Observable<KpiData[]> {
    return of(this.kpiDataSubject.value.filter(kpi => kpi.type === type));
  }

  // Get summary statistics
  getSummaryStats(): Observable<any> {
    const data = this.kpiDataSubject.value;
    const upTrends = data.filter(kpi => kpi.trend === 'up').length;
    const downTrends = data.filter(kpi => kpi.trend === 'down').length;
    const neutralTrends = data.filter(kpi => kpi.trend === 'neutral').length;
    
    return of({
      totalKpis: data.length,
      upTrends,
      downTrends,
      neutralTrends,
      averageTrendPercentage: data.reduce((acc, kpi) => acc + (kpi.trendPercentage || 0), 0) / data.length
    });
  }
}