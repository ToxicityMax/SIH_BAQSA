export enum Products {
  wheat = 'wheat',
  rice = 'rice',
  mangoes = 'mangoes',
  sugarcane = 'sugarcane',
}
export const ProductsDefaultValues = [
  {
    name: 'wheat',
    average_temp: 30,
    threshold: {
      temperature: [30, 43],
      humidity: [20, 30],
      accelerometer: [],
    },
  },
  {
    name: 'rice',
    average_temp: 28,
    threshold: {
      temperature: [20, 33],
      humidity: [20, 30],
      accelerometer: [],
    },
  },
  {
    name: 'mangoes',
    average_temp: 30,

    threshold: {
      temperature: [21, 35],
      humidity: [20, 30],
      accelerometer: [],
    },
  },
  {
    name: 'sugarcane',
    average_temp: 30,
    threshold: {
      temperature: [10, 25],
      humidity: [20, 30],
      accelerometer: [],
    },
  },
];
