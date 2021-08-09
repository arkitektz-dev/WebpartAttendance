import { WebPartContext } from "@microsoft/sp-webpart-base";

export class ListService {
  constructor(private _context: WebPartContext) {}

  public async get(): Promise<any[]> {
    return null;
  }
}

export default ListService;
