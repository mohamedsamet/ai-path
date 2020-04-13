import { Component, OnInit } from '@angular/core';
import {
  AI_STORAGE_GRID_X,
  AI_STORAGE_GRID_Y
} from 'src/app/constants/ai-user-constants';
import {
  AI_GRID_DEFAULT,
  AI_WINDOW_RESIZE_DEB_TIME,
  AI_WINDOW_PADDING,
  AI_KEYBOARD_ARROWS
} from 'src/app/constants/ai-grid-constants';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GridService } from '../grid.service';
import { MovementDirections } from 'src/app/models/movement-direction';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  public gridArray: number[];
  public nodeDim: string;
  public nodeNumber: number;
  public gridX: number;
  public gridY: number;
  public startNodeIndex: number;
  constructor(private gridService: GridService) {}

  ngOnInit(): void {
    this.setNodeNumber();
    this.calculNodeDim(window.innerWidth);
    this.listenToResize();
    this.listenToMovements();
    this.setStartNode();
    this.gridArray = Array(this.nodeNumber);
  }

  setStartNode() {
    this.startNodeIndex = this.gridService.getRandomNumber(this.nodeNumber);
  }

  move(key: MovementDirections) {
    switch (key) {
      case MovementDirections.ArrowDown: {
        if (this.startNodeIndex + this.gridX <= this.nodeNumber) {
          this.startNodeIndex += this.gridX;
        }
        break;
      }
      case MovementDirections.ArrowUp: {
        if (this.startNodeIndex - this.gridX >= 0) {
          this.startNodeIndex -= this.gridX;
        }
        break;
      }
      case MovementDirections.ArrowLeft: {
        if ((this.startNodeIndex - 1) % this.gridX !== 0) {
          this.startNodeIndex -= 1;
        }
        break;
      }
      case MovementDirections.ArrowRight: {
        if (this.startNodeIndex % this.gridX !== 0) {
          this.startNodeIndex += 1;
        }
        break;
      }
    }
  }

  mapIndexToCoordinateX(index, lineWidth) {
    return index - Math.floor(index / lineWidth) * lineWidth;
  }

  mapIndexToCoordinateY(index, lineWidth) {
    return Math.floor(index / lineWidth);
  }

  setNodeNumber() {
    if (
      localStorage.getItem(AI_STORAGE_GRID_X) &&
      localStorage.getItem(AI_STORAGE_GRID_Y)
    ) {
      this.gridX = +localStorage.getItem(AI_STORAGE_GRID_X);
      this.gridY = +localStorage.getItem(AI_STORAGE_GRID_Y);
    } else {
      this.gridX = AI_GRID_DEFAULT;
      this.gridY = AI_GRID_DEFAULT;
    }
    this.nodeNumber = this.gridX * this.gridY;
  }

  calculNodeDim(windowSize: number) {
    const availableWidth = windowSize - AI_WINDOW_PADDING;
    this.nodeDim = this.convertToPx(availableWidth / this.gridX);
  }

  convertToPx(value: number): string {
    return value + 'px';
  }

  listenToResize() {
    const resize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(AI_WINDOW_RESIZE_DEB_TIME))
      .subscribe((event: UIEvent) => {
        const win = event.target as Window;
        this.calculNodeDim(win.innerWidth);
      });
  }

  listenToMovements() {
    const move$ = fromEvent(window, 'keyup').subscribe(
      (event: KeyboardEvent) => {
        if (AI_KEYBOARD_ARROWS.includes(event.keyCode)) {
          this.move(MovementDirections[event.key]);
        }
      }
    );
  }
}
