import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  constructor() {}

  getRandomNumber(limit) {
    return Math.floor(Math.random() * limit + 1);
  }
}
