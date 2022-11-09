import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginGuard } from '../login.guard';
import { LoginService } from '../login/login-service.service';
import { Article } from '../models/Article';
import { HomeService } from './home.service';

@Component({
  selector: 'app-article',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [LoginGuard]
})
export class HomeComponent implements OnInit {
  articles$: Observable<Article[]>;
  tags$: Observable<{ tags: string }[]>;
  // tam = 17
  constructor(private homeService: HomeService, private loginService: LoginService) {
    this.articles$ = this.homeService.getAllArticles()
    this.tags$ = this.homeService.getAllTags()
  }

  ngOnInit(): void {
    this.tags$.subscribe();
    this.articles$.subscribe()
  }
  logout() {
    this.loginService.logoutSubmit();
  }
}
