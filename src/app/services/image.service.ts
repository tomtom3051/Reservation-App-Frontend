import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private http: HttpClient
  ) {}

  //Uploads an image to the backend
  //File object is the image being uploaded
  uploadImage(image: File) {
    //Create Formdata object
    const formData = new FormData();

    //Store image in formData object
    formData.append('image', image, image.name);

    return this.http.post<{
      message: string,
      url: string
    }>(
      'http://localhost:3000/image/upload',
      formData
    );
  }
}
