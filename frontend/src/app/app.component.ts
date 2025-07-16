import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';

interface Currency {
  code: string;
  name: string;
}

interface ConversionRecord {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currencies: Currency[] = [];
  from = '';
  to = '';
  amount: number | null = null;
  result: number | null = null;
  rate: number | null = null;
  loading = false;
  error = '';
  history: ConversionRecord[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchCurrencies();
    this.loadHistory();
  }

  fetchCurrencies() {
    this.loading = true;
    this.http.get<any>('/api/currencies').subscribe({
      next: (data) => {
        this.currencies = Object.entries(data.data).map(([code, info]: any) => ({
          code,
          name: info.name
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load currencies';
        this.loading = false;
      }
    });
  }

  convert() {
    if (!this.from || !this.to || !this.amount) return;
    this.loading = true;
    this.error = '';
    this.http.post<any>('/api/currencies/convert', {
      from: this.from,
      to: this.to,
      amount: this.amount
    }).subscribe({
      next: (data) => {
        this.result = data.result;
        this.rate = data.rate;
        this.loading = false;
        this.saveToHistory({
          from: data.from,
          to: data.to,
          amount: data.amount,
          result: data.result,
          rate: data.rate,
          date: new Date().toISOString()
        });
      },
      error: (err) => {
        this.error = err.error?.error || 'Conversion failed';
        this.loading = false;
      }
    });
  }

  saveToHistory(record: ConversionRecord) {
    this.history.unshift(record);
    localStorage.setItem('conversionHistory', JSON.stringify(this.history));
  }

  loadHistory() {
    const data = localStorage.getItem('conversionHistory');
    this.history = data ? JSON.parse(data) : [];
  }

  swapCurrencies() {
    [this.from, this.to] = [this.to, this.from];
  }

  clearHistory() {
    this.history = [];
    localStorage.removeItem('conversionHistory');
  }
}
