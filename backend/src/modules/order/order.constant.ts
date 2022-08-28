export enum Products {
  sugarcane = 'sugarcane',
}
export const ProductsDefaultValues = [
  {
    name: 'sugarcane',
    average_temp: 30,
    threshold: {
      temperature: [30, 43],
      humidity: [20, 30],
      npk: [],
      alcohol: [],
    },
  },
];
