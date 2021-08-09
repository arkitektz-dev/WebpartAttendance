import { WebPartContext } from "@microsoft/sp-webpart-base";

export class SiteService {
  constructor(private _context: WebPartContext) {}

  public async get(): Promise<any[]> {
    return null;
  }
}

export default SiteService;
