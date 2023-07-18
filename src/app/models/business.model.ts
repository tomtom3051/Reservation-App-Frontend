/**
 * This is the current model for what a business should contain.
 * @param name is the name of the business.
 * @param description is a short description about the business desplayed in the list.
 * @param imagePath shows the path to an image to represent the business.
 * In the future this will also contain photo's, locations and more.
 */
export class BusinessModel {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public profileImgPath: string,
    public description: string,
    public location: string
  ) {}
}
