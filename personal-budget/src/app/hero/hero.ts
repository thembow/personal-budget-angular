import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  standalone: true,
  selector: 'pb-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {

}
