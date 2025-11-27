import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss']
})
export class NotAuthorizedComponent {

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goBack() {
    window.history.back();
  }

}

