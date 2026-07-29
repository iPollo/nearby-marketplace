import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { CityResponse } from '../models/listing.model';

@Injectable({ providedIn: 'root' })
export class CityService {

  private readonly baseUrl = `${environment.apiUrl}/cities`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<CityResponse[]> {
    return this.http.get<CityResponse[]>(this.baseUrl);
  }
}
