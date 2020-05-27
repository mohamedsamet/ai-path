import { Component, OnInit } from '@angular/core';
import { AI_STORAGE_GRID_X, AI_STORAGE_GRID_Y } from 'src/app/constants/ai-user-constants';
import {
  AI_GRID_DEFAULT, AI_KEYBOARD_ARROWS, AI_PATH_AUTO_INTERVAL, AI_PATH_MANUAL_INTERVAL, AI_PATH_OPRATION_MODE, AI_WINDOW_PADDING, AI_WINDOW_RESIZE_DEB_TIME
} from 'src/app/constants/ai-grid-constants';
import { fromEvent, interval, Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { GridService } from '../grid.service';
import { MovementDirections } from 'src/app/models/movement-direction';
import { OperationMode } from '../../models/opration-mode';
import { BasicDirectionAlgorithm } from '../algorithms/basic-direction-algorithm';
import { AutoMoveType } from '../../models/auto-move-type';

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
  public endNodeIndex: number;
  public activeNodesArray: number[] = [];
  public neighboursNodesArray: number[] = [];
  public tryNodesArray: number[] = [];
  public intervalSubscription: Subscription;
  public movementSubscription: Subscription;
  public gameOver: boolean;
  public operationMode: OperationMode = OperationMode[AI_PATH_OPRATION_MODE.toString()];
  private autoMoveType: AutoMoveType;

  constructor(private gridService: GridService) {
  }

  ngOnInit(): void {
    this.setNodeNumber();
    this.calculNodeDim(window.innerWidth);
    this.listenToResize();
    this.listenToMovements();
    this.setStartAndEndNode();
    this.gridArray = Array(this.nodeNumber);
  }

  setStartAndEndNode() {
    this.startNodeIndex = this.gridService.getRandomNumber(this.nodeNumber);
    this.endNodeIndex = this.gridService.getRandomNumber(this.nodeNumber);
    this.activeNodesArray.push(this.startNodeIndex);
  }

  unsubscribeIntervalPaths() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  restartFinding() {
    this.activeNodesArray = [];
    this.setStartAndEndNode();
    this.unsubscribeIntervalPaths();
    this.gameOver = false;
  }

  mapIndexToCoordinateX(index, lineWidth) {
    return index - Math.floor((index - 1) / lineWidth) * lineWidth;
  }

  mapIndexToCoordinateY(index, lineWidth) {
    return Math.floor((index - 1) / lineWidth);
  }

  getPointCoordinate(index, width) {
    return {
      coord: {
        x: this.mapIndexToCoordinateX(index, width),
        y: this.mapIndexToCoordinateY(index, width)
      }
    };
  }

  lunchAutoTimerAIMovement() {
    const inter = interval(AI_PATH_AUTO_INTERVAL).pipe(startWith(0));
    this.intervalSubscription = inter.subscribe(() => {
      const lastNode = this.activeNodesArray.slice().pop();
      const movementI = new BasicDirectionAlgorithm(this.getPointCoordinate(lastNode, this.gridX), this.getPointCoordinate(this.endNodeIndex, this.gridX));
      this.move(this.getAutoMovememntType(movementI));
    });
  }

  lunchAutoAIMovement() {
    let lastNode = this.activeNodesArray.slice().pop();
    while (lastNode !== this.endNodeIndex) {
      const movementI = new BasicDirectionAlgorithm(this.getPointCoordinate(lastNode, this.gridX), this.getPointCoordinate(this.endNodeIndex, this.gridX));
      this.move(this.getAutoMovememntType(movementI));
      lastNode = this.activeNodesArray.slice().pop();
    }
  }

  lunchManualIntervalMovement(key: MovementDirections) {
    const inter = interval(AI_PATH_MANUAL_INTERVAL).pipe(startWith(0));
    this.intervalSubscription = inter.subscribe(() => {
      this.move(key);
    });
  }

  getAutoMovememntType(algoInstance: BasicDirectionAlgorithm) {
    switch (this.autoMoveType) {
      case AutoMoveType.Y_PRIO: {
        return algoInstance.getMovementTypeYPrio();
      }
      case AutoMoveType.X_PRIO: {
        return algoInstance.getMovementTypeXPrio();
      }
    }
  }

  move(usingKey: MovementDirections) {
    const lastNode = this.activeNodesArray.slice().pop();
    if (lastNode !== this.endNodeIndex) {
      switch (usingKey) {
        case MovementDirections.ArrowDown: {
          if (lastNode + this.gridX <= this.nodeNumber && !this.activeNodesArray.includes(lastNode + this.gridX)) {
            this.activeNodesArray.push(lastNode + this.gridX);
          } else {
            this.gameOver = true;
          }
          break;
        }
        case MovementDirections.ArrowUp: {
          if (lastNode - this.gridX >= 0 && !this.activeNodesArray.includes(lastNode - this.gridX)) {
            this.activeNodesArray.push(lastNode - this.gridX);
          } else {
            this.gameOver = true;
          }
          break;
        }
        case MovementDirections.ArrowLeft: {
          if ((lastNode - 1) % this.gridX !== 0 && !this.activeNodesArray.includes(lastNode - 1)) {
            this.activeNodesArray.push(lastNode - 1);
          } else {
            this.gameOver = true;
          }
          break;
        }
        case MovementDirections.ArrowRight: {
          if (lastNode % this.gridX !== 0 && !this.activeNodesArray.includes(lastNode + 1)) {
            this.activeNodesArray.push(lastNode + 1);
          } else {
            this.gameOver = true;
          }
          break;
        }
      }
    }
  }

  checkPathFind() {
    return this.activeNodesArray.slice().pop() === this.endNodeIndex;
  }

  isActive(index) {
    return this.activeNodesArray.includes(index);
  }

  setNodeNumber() {
    if (localStorage.getItem(AI_STORAGE_GRID_X) && localStorage.getItem(AI_STORAGE_GRID_Y)) {
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
    fromEvent(window, 'resize')
    .pipe(debounceTime(AI_WINDOW_RESIZE_DEB_TIME))
    .subscribe((event: UIEvent) => {
      const win = event.target as Window;
      this.calculNodeDim(win.innerWidth);
    });
  }

  startPathFind(event: KeyboardEvent) {
    this.unsubscribeIntervalPaths();
    switch (this.operationMode) {
      case OperationMode.MANUAL: {
        this.lunchManualIntervalMovement(MovementDirections[event.key]);
        break;
      }
      case OperationMode.AUTO_TIMER: {
        this.lunchAutoTimerAIMovement();
        break;
      }
      case OperationMode.AUTO: {
        this.lunchAutoAIMovement();
        break;
      }
    }
  }

  changeMode(type: OperationMode, autoMoveType?: AutoMoveType) {
    this.operationMode = type;
    if (type !== OperationMode.MANUAL) {
      this.autoMoveType = autoMoveType;
    }
    this.restartFinding();
  }

  listenToMovements() {
    this.movementSubscription = fromEvent(window, 'keydown').subscribe((event: KeyboardEvent) => {
      if (AI_KEYBOARD_ARROWS.includes(event.keyCode)) {
        this.startPathFind(event);
      }
    });
  }

  aStarModeAlgoLunch() {
    this.operationMode = OperationMode.A_STAR;
    let i = 0;
    while (!this.activeNodesArray.includes(this.endNodeIndex) && i < 10) {
      i++;
      this.neighboursNodesArray = this.getNeighbours(this.startNodeIndex, this.gridX);
      console.log(this.neighboursNodesArray);
    }
  }

  getNeighbours(index, width) {
    const neighbourArray = [index + 1, index - 1, index - width + 1, index - width, index - width - 1, index + width - 1, index + width + 1, index + width];
    return neighbourArray.filter(elem => (elem > 0) && (elem <= this.nodeNumber) && !this.isXRightlimit(elem, index) && !this.isXLeftLimit(elem, index));
  }

  isXRightlimit(elem, index) {
    return (index % this.gridX === 0 && (elem === index - this.gridX + 1 || elem === index + 1 || elem === index + this.gridX + 1));
  }

  isXLeftLimit(elem, index) {
    return ((index - 1) % this.gridX === 0 && (elem === index - this.gridX - 1 || elem === index - 1 || elem === index + this.gridX - 1));
  }
}
