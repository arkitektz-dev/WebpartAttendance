import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IWeb, Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

export class UserService {
  private _web: IWeb = null;
  private _currentUser: string = null;

  constructor(private _context: WebPartContext) {
    this._web = Web(_context.pageContext.web.absoluteUrl);
    this._currentUser = _context.pageContext.user.email;
  }

  public async getCurrentUserByEmail(siteURL: string): Promise<any> {
    const web = Web(siteURL);
    let toSelect: string[] = ["Id", "Email", "LoginName", "UserPrincipalName"];

    const response = await web.siteUsers
      .getByEmail(this._currentUser)
      .select(...toSelect)
      .get()
      .then((res) => {
        // console.log(res);
        return res;
      })
      .catch((error) => {
        console.log(
          "'Method Name': User Service --> getCurrentUserByEmail",
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

export default UserService;
