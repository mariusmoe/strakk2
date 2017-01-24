import { Component, OnInit, Input } from '@angular/core';
import { RecipeService } from '../../_services/index'
// import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";

import { Recipe } from '../../_models/index';

@Component({
  selector: 'app-one',
  templateUrl: './one.component.html',
  styleUrls: ['./one.component.css']
})
export class OneComponent implements OnInit {

  private recipe: Recipe;
  private recipeID: string;

  constructor(
    private recipeService: RecipeService,
    private route : ActivatedRoute,
    // private _location : Location
  ) { }

  ngOnInit() {
    this.recipeID = this.route.snapshot.params["recipeid"];  // get the recipe id from the url
    this.getOneRecipeById();
  }

getOneRecipeById(){
  this.recipeService.getRecipeById(this.recipeID)
    .subscribe(recipe => {
      this.recipe = recipe;
    });
  }
}
