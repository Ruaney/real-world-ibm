import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Article } from '../models/Article';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  API_URL = 'https://api.realworld.io/api'

  constructor(private http: HttpClient) { }
  public getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.API_URL}/articles`).
      pipe(
        map((data:any) => data.articles)
      )
  }
  public getAllTags(): Observable<{tags: string}[]> {
    return this.http.get<{tags: string}[]>(`${this.API_URL}/tags`).
      pipe(
        map((data:any) => data.tags)
      )
  }
}
