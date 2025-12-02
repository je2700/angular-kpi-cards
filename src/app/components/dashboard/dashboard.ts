import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent, KpiData } from '../kpi-card/kpi-card';
import { KpiDataService } from '../../services/kpi-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, KpiCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  kpiData: KpiData[] = [];
  filteredKpiData: KpiData[] = [];
  selectedFilter: string = 'all';
  viewMode: 'grid' | 'list' | 'compact' = 'grid';
  theme: 'light' | 'dark' | 'gradient' = 'light';
  isLoading = true;
  summaryStats: any = {};
  
  filterOptions = [
    { value: 'all', label: 'Alle KPIs', icon: '■' },
    { value: 'metric', label: 'Metriken', icon: '▲' },
    { value: 'progress', label: 'Fortschritt', icon: '●' },
    { value: 'comparison', label: 'Vergleiche', icon: '⇄' },
    { value: 'chart', label: 'Charts', icon: '▼' }
  ];
  
  viewOptions = [
    { value: 'grid', label: 'Grid', icon: '▦' },
    { value: 'list', label: 'Liste', icon: '≡' },
    { value: 'compact', label: 'Kompakt', icon: '▪' }
  ];
  
  themeOptions = [
    { value: 'light', label: 'Hell', icon: '○' },
    { value: 'dark', label: 'Dunkel', icon: '●' },
    { value: 'gradient', label: 'Gradient', icon: '◐' }
  ];

  constructor(private kpiDataService: KpiDataService) {}

  ngOnInit() {
    this.loadKpiData();
    this.loadSummaryStats();
    // Start real-time updates
    this.kpiDataService.simulateRealTimeUpdates();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadKpiData() {
    this.kpiDataService.getKpiData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.kpiData = data;
        this.applyFilter();
        this.isLoading = false;
      });
  }
  
  private loadSummaryStats() {
    this.kpiDataService.getSummaryStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.summaryStats = stats;
      });
  }
  
  applyFilter() {
    if (this.selectedFilter === 'all') {
      this.filteredKpiData = this.kpiData;
    } else {
      this.filteredKpiData = this.kpiData.filter(kpi => kpi.type === this.selectedFilter);
    }
  }
  
  onFilterChange(filter: string) {
    this.selectedFilter = filter;
    this.applyFilter();
  }
  
  onViewModeChange(mode: 'grid' | 'list' | 'compact') {
    this.viewMode = mode;
  }
  
  onThemeChange(theme: 'light' | 'dark' | 'gradient') {
    this.theme = theme;
  }
  
  getCardType(): 'default' | 'compact' | 'detailed' | 'chart' {
    switch (this.viewMode) {
      case 'compact': return 'compact';
      case 'list': return 'detailed';
      default: return 'default';
    }
  }
  
  getTrendSummary(): string {
    const upTrends = this.summaryStats.upTrends || 0;
    const downTrends = this.summaryStats.downTrends || 0;
    
    if (upTrends > downTrends) {
      return `▲ ${upTrends} KPIs mit positiver Entwicklung`;
    } else if (downTrends > upTrends) {
      return `▼ ${downTrends} KPIs benötigen Aufmerksamkeit`;
    } else {
      return `◆ Ausgewogene Performance`;
    }
  }
  
  refreshData() {
    this.isLoading = true;
    setTimeout(() => {
      this.loadKpiData();
      this.loadSummaryStats();
    }, 1000);
  }
  
  exportData() {
    const data = JSON.stringify(this.kpiData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kpi-data.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  trackByKpi(index: number, kpi: KpiData): string {
    return kpi.title;
  }
  
  getCurrentTime(): string {
    return new Date().toLocaleString('de-DE');
  }
}