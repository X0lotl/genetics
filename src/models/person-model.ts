import { Alel } from "./alel-model"

export interface Person {
  values: {
    alel: Alel,
    values : [string, string]
  }[]
}