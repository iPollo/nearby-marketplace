import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListingResponse } from '../models/listing.model';
import { PageResponse } from '../models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ListingService {

  private readonly baseUrl = `${environment.apiUrl}/listings`;

  constructor(private http: HttpClient) {}

  findActive(page = 0, size = 12): Observable<PageResponse<ListingResponse>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<ListingResponse>>(this.baseUrl, { params });
  }

  findNearby(latitude: number, longitude: number, radiusKm = 20, page = 0, size = 12): Observable<PageResponse<ListingResponse>> {
    const params = new HttpParams()
      .set('latitude', latitude)
      .set('longitude', longitude)
      .set('radiusKm', radiusKm)
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<ListingResponse>>(`${this.baseUrl}/nearby`, { params });
  }

  findById(id: number): Observable<ListingResponse> {
    return this.http.get<ListingResponse>(`${this.baseUrl}/${id}`);
  }

}
