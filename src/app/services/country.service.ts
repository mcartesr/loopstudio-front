import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../models/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly API_URL = 'http://localhost:8080/api/countries';
  
  constructor(private http: HttpClient) {}

  getSpecificCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.API_URL);
  }
}