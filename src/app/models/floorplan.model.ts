export class FloorplanModel {
  constructor(
    public id: number | null,
    public businessId: number,
    public height: number,
    public width: number,
    public name: string
  ) {}
}
