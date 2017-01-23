import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';
import { User, Recipe } from '../_models/index';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map'

@Injectable()
export class RecipeService {

  private token: string;
  private allRecipes: Recipe[] = new Array<Recipe>();

  private urlGetRecipes: string = environment.URL.getRecipes

  constructor(private http: Http) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  getRecipes(): Observable<Recipe[]> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.token}`);

    return this.http.get(this.urlGetRecipes, { headers, search: "none yet", })//.cache()
      .map((response: Response) => {
        let json = response.json();
        let recipes = json.recipes;

        for (let recipe in recipes){
          let a = new Recipe();
          a.strakkId  = recipes[recipe].strakkId;
          a.title     = recipes[recipe].title;
          a.intro     = recipes[recipe].intro;
          a.txt       = recipes[recipe].txt;
          a.price     = recipes[recipe].price;
          a.coverimg  = recipes[recipe].coverimg;
          a.symbolLink= recipes[recipe].symbolLink;
          a.otherImg  = recipes[recipe].otherImg;
          a.diagramImg= recipes[recipe].diagramImg  ;

          this.allRecipes.push(a);
        }
          return this.allRecipes;
        }
      ).catch((error: any) => {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        // console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
      });
    };

  }
