import { Component, OnInit } from '@angular/core';
import { AI_STORAGE_USERNAME } from '../constants/ai-user-constants';
import { Router } from '@angular/router';
import { AI_GRID_MIN_X } from '../constants/ai-grid-constants';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public userName: string;
  public minGridX = AI_GRID_MIN_X;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getUserNameFromStorage();
  }

  private getUserNameFromStorage() {
    this.userName = localStorage.getItem(AI_STORAGE_USERNAME);
  }

  goOut() {
    localStorage.removeItem(AI_STORAGE_USERNAME);
    this.router.navigate(['login']);
  }
}
