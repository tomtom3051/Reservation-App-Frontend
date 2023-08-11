export class ReservableModel {
  constructor(
    public id: number | null,
    public floorplanId: number | null,
    public businessId: number,
    public x: number,
    public y: number,
    public height: number,
    public width: number,
    public capacity: number,
    public label: string
  ) {}
}
