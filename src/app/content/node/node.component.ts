import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  @Input() nodeDim: string;
  @Input() isActive: boolean;
  @Input() isEnd: boolean;
  constructor() {}

  ngOnInit(): void {}
}
