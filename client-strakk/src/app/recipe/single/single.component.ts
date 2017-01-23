import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../../_models/index';

@Component({
  selector: 'recipe-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.css']
})
export class SingleComponent implements OnInit {

  @Input() recipe: Recipe;

  @Output() tag: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onTagClick(e:MouseEvent, s: string) {
    this.tag.emit(s);
  }



}
