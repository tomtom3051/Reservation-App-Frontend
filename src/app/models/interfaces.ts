export interface iBusinessHoursModel {
  day: string,
  opening_time: Date,
  closing_time: Date
}

export interface iBusinessHoursModelTemp {
  id: number | null,
  day: string,
  opening_time: string,
  closing_time: string
}

export interface iBusinessHoursModelId {
  id: number | null,
  day: string,
  opening_time: Date | null,
  closing_time: Date | null
}

