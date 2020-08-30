export default interface IFile {
  id?: number | null;
  name: string;
  path: string;
  isDir: boolean;
  description?: string;
  author?: string;
  publishedOn?: Date | null;
  createdOn?: Date | null;
  updatedOn?: Date | null;
}
