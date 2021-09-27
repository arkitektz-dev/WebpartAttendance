import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IWeb, Web } from "@pnp/sp/webs";
import { formatLogMessage } from "../utils/logsUtils";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";

class FileService {
  private _web: IWeb = null;
  private _currentUser: string = null;
  private serverRelativeUrl: string = null;

  constructor(private _context: WebPartContext) {
    this._web = Web(_context.pageContext.web.absoluteUrl);
    this._currentUser = this._context.pageContext.user.email;
    this.serverRelativeUrl = _context.pageContext.site.serverRelativeUrl;
  }

  public async ensureSiteAssetsLibraryExist() {
    try {
      const response = await this._web.lists.ensureSiteAssetsLibrary();
      const siteAssetsLibrary = await response.select("Title")();
      // console.log("ensureSiteAssetsLibraryExist", response);
      // console.log("ensureSiteAssetsLibraryExist siteAssetsLibrary", siteAssetsLibrary);

      return true;
    } catch (error) {
      console.log(
        "'Method Name': File Service --> ensureSiteAssetsLibraryExist",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );
      return false;
    }
  }

  public async checkFolderExist(folderPath: string): Promise<boolean> {
    try {
      const path =
        this.serverRelativeUrl.length === 1
          ? folderPath
          : `${this.serverRelativeUrl}${folderPath}`;

      const response = await this._web
        .getFolderByServerRelativeUrl(path)
        .select("Exists")
        .get();
      // console.log("checkFolderExist", response);

      return response.Exists;
    } catch (error) {
      console.log(
        "'Method Name': File Service --> checkFolderExist",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );
      return false;
    }
  }

  public async addFolder(folderName: string): Promise<boolean> {
    try {
      const response = await this._web.lists
        .getByTitle("Site Assets")
        .rootFolder.folders.add(folderName);
      // console.log("addFolder", response);

      return true;
    } catch (error) {
      console.log(
        "'Method Name': File Service --> addFolder",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );
      return false;
    }
  }

  public async readFile(filePath: string): Promise<any> {
    try {
      const path =
        this.serverRelativeUrl.length === 1
          ? filePath
          : `${this.serverRelativeUrl}${filePath}`;

      const response = await this._web
        .getFileByServerRelativeUrl(path)
        .getJSON();
      // console.log("readFile", response);

      return response;
    } catch (error) {
      console.log(
        "'Method Name': File Service --> readFile",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );
      return false;
    }
  }

  public async addFile(file: File, uploadPath: string): Promise<boolean> {
    try {
      const path =
        this.serverRelativeUrl.length === 1
          ? uploadPath
          : `${this.serverRelativeUrl}${uploadPath}`;

      const response = await this._web
        .getFolderByServerRelativeUrl(path)
        .files.add(file.name, file, false);
      // console.log("addFile", response);

      return true;
    } catch (error) {
      console.log(
        "'Method Name': File Service --> addFile",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );
      return false;
    }
  }

  public async checkFileExist(filePath: string): Promise<boolean> {
    try {
      const path =
        this.serverRelativeUrl.length === 1
          ? filePath
          : `${this.serverRelativeUrl}${filePath}`;

      const response = await this._web
        .getFileByServerRelativeUrl(path)
        .select("Exists")
        .get();
      // console.log("checkFileExist", response);

      return response.Exists;
    } catch (error) {
      console.log(
        "'Method Name': File Service --> checkFileExist",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );
      return false;
    }
  }

  public async updateLogFileContent(
    error: Error,
    filePath: string,
    type: string = "error"
  ): Promise<boolean> {
    try {
      const logEntry = formatLogMessage(error, type, this._currentUser);

      const oldContent = await this._web
        .getFileByServerRelativeUrl(filePath)
        .getText();

      const response = await this._web
        .getFileByServerRelativeUrl(filePath)
        .setContent(`${oldContent}\n${logEntry}`);

      // console.log("updateLogFileContent", response);

      return true;
    } catch (error) {
      console.log(
        "'Method Name': File Service --> updateLogFileContent",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );

      return false;
    }
  }
}

export default FileService;
