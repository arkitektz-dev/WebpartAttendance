import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IWeb, Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";

export class FileService {
  private _web: IWeb = null;
  private serverRelativeUrl: string = null;

  constructor(private _context: WebPartContext) {
    this._web = Web(_context.pageContext.web.absoluteUrl);
    this.serverRelativeUrl = _context.pageContext.site.serverRelativeUrl;
  }

  public async checkFolderExist(folderPath: string): Promise<boolean> {
    const path =
      this.serverRelativeUrl.length === 1
        ? folderPath
        : `${this.serverRelativeUrl}${folderPath}`;

    const response = await this._web
      .getFolderByServerRelativeUrl(path)
      .select("Exists")
      .get()
      .then((res) => {
        // console.log(res);
        return res.Exists;
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service --> checkFolderExist",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return false;
      });

    // console.log(response);

    return response;
  }

  public async addFolder(folderName: string): Promise<any> {
    const response = await this._web.lists
      .getByTitle("Site Assets")
      .rootFolder.folders.add(folderName)
      .then((res) => {
        // console.log(res);
        return true;
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service --> addFolder",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return false;
      });

    // console.log(response);

    return response;
  }

  public async readFile(filePath: string): Promise<any> {
    const path =
      this.serverRelativeUrl.length === 1
        ? filePath
        : `${this.serverRelativeUrl}${filePath}`;

    const response = await this._web
      .getFileByServerRelativeUrl(path)
      .getJSON()
      .then((res) => {
        // console.log(res);
        return res;
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service --> readFile",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return false;
      });

    // console.log(response);

    return response;
  }

  public async addFile(file: File, uploadPath: string): Promise<any> {
    const path =
      this.serverRelativeUrl.length === 1
        ? uploadPath
        : `${this.serverRelativeUrl}${uploadPath}`;

    const response = await this._web
      .getFolderByServerRelativeUrl(path)
      .files.add(file.name, file, false)
      .then((res) => {
        // console.log(res);
        return true;
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service --> addFile",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return false;
      });

    // console.log(response);

    return response;
  }

  public async checkFileExist(filePath: string): Promise<boolean> {
    const path =
      this.serverRelativeUrl.length === 1
        ? filePath
        : `${this.serverRelativeUrl}${filePath}`;

    const response = await this._web
      .getFileByServerRelativeUrl(path)
      .select("Exists")
      .get()
      .then((res) => {
        // console.log(res);
        return true;
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service --> checkFileExist",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return false;
      });

    // console.log(response);

    return response;
  }
}

export default FileService;
