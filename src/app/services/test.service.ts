import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TestService {
  //This service is here to handle http requests used while testing a feature

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  //In real use username instead of title or business name
  postImage(image: File) {
    const imgData = new FormData();
    imgData.append("image", image)

    this.http.post<{ message: string, url: string }>(
      "http://localhost:3000/image/upload",
      imgData
    ).subscribe(result => {
      console.log(result.url);
    })
  }
}
