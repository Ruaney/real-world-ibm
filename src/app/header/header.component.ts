import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LoginGuard } from '../login.guard';
import { LoginService } from '../login/login-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent implements OnInit {
  constructor(private loginService: LoginService) {
    
  } 
  
  ngOnInit(): void {
  }
}
