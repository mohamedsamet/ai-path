import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AI_STORAGE_USERNAME,
  AI_STORAGE_GRID_X,
  AI_STORAGE_GRID_Y
} from '../constants/ai-user-constants';
import { ConfigGridModel } from '../models/config-grid.model';
import {
  AI_GRID_MIN_X,
  AI_GRID_MIN_Y,
  AI_GRID_DEFAULT
} from '../constants/ai-grid-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public userName: string;
  public minGridX = AI_GRID_MIN_X;
  public minGridY = AI_GRID_MIN_Y;
  public config: ConfigGridModel = {
    coord: { x: AI_GRID_DEFAULT, y: AI_GRID_DEFAULT }
  };
  constructor(private router: Router) {}

  saveLogin() {
    localStorage.setItem(AI_STORAGE_USERNAME, this.userName);
    localStorage.setItem(AI_STORAGE_GRID_X, this.config.coord.x.toString());
    localStorage.setItem(AI_STORAGE_GRID_Y, this.config.coord.y.toString());
    this.router.navigate(['../']);
  }
}
