import { PointCoordinate } from '../../models/point-coordinate';
import { MovementDirections } from '../../models/movement-direction';
import { BehaviorSubject } from 'rxjs';

export class BasicDirectionAlgorithm {
  private startPoint: PointCoordinate;
  private endPoint: PointCoordinate;
  private positionEmitter = new BehaviorSubject<MovementDirections>(null);

  constructor(private start, private end) {
    this.startPoint = start;
    this.endPoint = end;
  }

  public getMovementTypeXPrio(): MovementDirections {
    let movementType: MovementDirections;
    const startX = this.startPoint.coord.x;
    const startY = this.startPoint.coord.y;
    const endX = this.endPoint.coord.x;
    const endY = this.endPoint.coord.y;
    if (startX < endX) {
      movementType = MovementDirections.ArrowRight;
    } else if (startX > endX) {
      movementType = MovementDirections.ArrowLeft;
    } else if (startY < endY) {
      movementType = MovementDirections.ArrowDown;
    } else {
      movementType = MovementDirections.ArrowUp;
    }
    this.positionEmitter.next(movementType);
    return movementType;
  }

  public getMovementTypeYPrio(): MovementDirections {
    let movementType: MovementDirections;
    const startX = this.startPoint.coord.x;
    const startY = this.startPoint.coord.y;
    const endX = this.endPoint.coord.x;
    const endY = this.endPoint.coord.y;
    if (startY < endY) {
      movementType = MovementDirections.ArrowDown;
    } else if (startY > endY) {
      movementType = MovementDirections.ArrowUp;
    } else if (startX < endX) {
      movementType = MovementDirections.ArrowRight;
    } else {
      movementType = MovementDirections.ArrowLeft;
    }
    this.positionEmitter.next(movementType);
    return movementType;
  }

  getPositionEmitter(): BehaviorSubject<MovementDirections> {
    return this.positionEmitter;
  }

}
