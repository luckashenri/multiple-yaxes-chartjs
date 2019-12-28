import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  getDataSet() {
    return this.http.get<any[]>('assets/dataset.json');
  }
}
