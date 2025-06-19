import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Property {
  id: number;
  title: string;
  address?: string; // poner opcional si puede ser null
  description: string;
  price: number;
  city: string;
  type: string;
  cp: number;
  images: { id: number; url: string }[];
  isFavorite?: boolean;
}


@Injectable({ providedIn: 'root' })
export class PropertyService {

  private baseUrl = '/api/properties';
  private imageBaseUrl = '/api/images';

  constructor(private http: HttpClient) {}

  getProperties(filters?: { city?: string; type?: string; min?: number; max?: number }): Observable<Property[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.city) params = params.set('city', filters.city);
      if (filters.type) params = params.set('type', filters.type);
      if (filters.min !== undefined) params = params.set('min', filters.min.toString());
      if (filters.max !== undefined) params = params.set('max', filters.max.toString());
    }

    return this.http.get<Property[]>('/api/properties', { params });
  }

  getPropertyById(id: number, token?: string): Observable<Property> {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<Property>(`${this.baseUrl}/${id}`, { headers });
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

  updateProperty(property: Property, token: string): Observable<Property> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<Property>(`/api/properties/${property.id}`, property, { headers });
  }


  updatePropertyWithImages(id: number, formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.baseUrl}/${id}/update-with-images`, formData, { headers });
  }

  deleteImage(imageId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.imageBaseUrl}/${imageId}`, { headers });
  }

  createPropertyWithImages(formData: FormData, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Aquí cambias la URL a /api/properties sin 'create-with-images'
    return this.http.post('/api/properties', formData, { headers });

  }

  deleteProperty(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }
}