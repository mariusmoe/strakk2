import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../_services/index'
import { Recipe } from '../../_models/index';

@Component({
  selector: 'recipe-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

  private recipes: Recipe[] = [];

  private loading: boolean = false;

  constructor(
    private recipeService: RecipeService) {

    }

  ngOnInit() {
    this.getRecipes();
  }


  private getRecipes() {
    this.loading = true;
    this.recipeService.getRecipes().subscribe(result => {
      this.recipes = result;
      this.loading = false;
    })
  }

};
