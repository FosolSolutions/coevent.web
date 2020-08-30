export default interface IList<T> {
  page: number;
  total: number;
  items: T[];
}
