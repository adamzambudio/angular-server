import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  type: string;
  cp: number;
  image: [];
}

@Injectable({ providedIn: 'root' })
export class PropertyService {

  private baseUrl = 'http://localhost:8000/api/properties';

  constructor(private http: HttpClient) {}

  getProperties(filters?: { city?: string; type?: string; min?: number; max?: number }): Observable<Property[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.city) params = params.set('city', filters.city);
      if (filters.type) params = params.set('type', filters.type);
      if (filters.min !== undefined) params = params.set('min', filters.min.toString());
      if (filters.max !== undefined) params = params.set('max', filters.max.toString());
    }

    return this.http.get<Property[]>('http://localhost:8000/get_properties.php', { params });
  }



  getPropertyById(id: number) {
    return this.http.get(`http://localhost:8000/get_properties_by_id.php?id=${id}`);
  }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/cities`);
  }

  getTypes(city?: string): Observable<string[]> {
    let params = new HttpParams();
    if (city) {
      params = params.set('city', city);
    }
    return this.http.get<string[]>(`${this.baseUrl}/types`, { params });
  }

  getPriceRange(city?: string, type?: string): Observable<{ min: number; max: number }> {
    let params = new HttpParams();
    if (city) params = params.set('city', city);
    if (type) params = params.set('type', type);
    return this.http.get<{ min: number; max: number }>(`${this.baseUrl}/prices`, { params });
  }
}
