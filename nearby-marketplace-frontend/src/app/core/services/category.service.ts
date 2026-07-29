import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryResponse } from '../models/listing.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.baseUrl);
  }
}
