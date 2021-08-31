import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Web, IWeb } from "@pnp/sp/webs";
import { IViewFields } from "@pnp/sp/views";
import { IList, IListColumn } from "./../models";
import { IWebpartConfiguration } from "./../models/IWebpartConfiguration";
import { IAttendanceListItem } from "./../models/IAttendanceListItem";
import "@pnp/sp/fields";
import "@pnp/sp/lists";
import "@pnp/sp/views";
import { IUser } from "./../models/IUser";

export class ListService {
  private _web: IWeb = null;
  private _currentUser: string = null;

  constructor(private _context: WebPartContext) {
    this._web = Web(_context.pageContext.web.absoluteUrl);
    this._currentUser = this._context.pageContext.user.email;
  }

  public async getLists(siteURL: string): Promise<IList[]> {
    const web = Web(siteURL);
    const filterstring = `Hidden eq false`;
    let lists: IList[] = [];

    const response = await web.lists
      .filter(filterstring)
      .get()
      .then((res) => {
        // console.log(res);
        lists = res.map((item) => {
          const list: IList = {} as IList;

          list.id = item.Id;
          list.title = item.Title;

          return list;
        });

        return lists;
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service->getLists",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return lists;
      });

    return response;
  }

  public async getListColumns(
    siteURL: string,
    listName: string
  ): Promise<IListColumn[]> {
    let listColumns: IListColumn[] = [];
    const web = Web(siteURL);
    const list = web.lists.getByTitle(listName);
    const filterstring = "Hidden eq false and ReadOnlyField eq false";

    try {
      const fields: IViewFields[] = await list.fields
        .filter(filterstring)
        .get();

      // console.log(fields);

      listColumns = fields.map((item) => {
        const listColumn: IListColumn = {} as IListColumn;

        listColumn.title = item["Title"];
        listColumn.internalName = item["InternalName"];
        listColumn.type = item["odata.type"];

        return listColumn;
      });
    } catch (error) {
      console.log(
        "'Method Name': List Service->getListColumns",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );
    }

    return listColumns;
  }

  public async getAttendanceListItems(
    webpartConfiguration: IWebpartConfiguration
  ): Promise<IAttendanceListItem> {
    const {
      attendanceListSiteURL,
      attendanceListName,
      attendanceListUserColumn,
      attendanceListTimeinColumn,
      attendanceListTimeoutColumn,
    } = webpartConfiguration;
    const web = Web(attendanceListSiteURL);
    let filterstring = `${attendanceListUserColumn}/EMail eq '${this._currentUser}' and ${attendanceListTimeoutColumn} eq null`;
    let toSelect: string[] = [
      "Id",
      attendanceListTimeinColumn,
      attendanceListTimeoutColumn,
      `${attendanceListUserColumn}/Title`,
      `${attendanceListUserColumn}/EMail`,
    ];
    let toExpand: string[] = [attendanceListUserColumn];

    const response = await web.lists
      .getByTitle(attendanceListName)
      .items.select(...toSelect)
      .expand(...toExpand)
      .filter(filterstring)
      .get()
      .then((res) => {
        // console.log(res);
        if (res.length === 0) return null;

        let attendanceListItem = {} as IAttendanceListItem;

        attendanceListItem = {
          id: res[0].Id,
          userId: null,
          timein: res[0][attendanceListTimeinColumn],
          timeout: null,
        };

        return attendanceListItem;
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service->getAttendanceListItems",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return null;
      });

    return response;
  }

  public async getUserListItems(
    webpartConfiguration: IWebpartConfiguration
  ): Promise<IUser> {
    const {
      usersListSiteURL,
      usersListName,
      usersListTitleColumn,
      usersListOfficeLocationCoordinatesColumn,
    } = webpartConfiguration;

    const web = Web(usersListSiteURL);
    let filterstring = `${usersListTitleColumn}/EMail eq '${this._currentUser}'`;
    let toSelect: string[] = [
      `${usersListTitleColumn}/EMail`,
      usersListOfficeLocationCoordinatesColumn,
    ];
    let toExpand: string[] = [usersListTitleColumn];

    const response = await web.lists
      .getByTitle(usersListName)
      .items.select(...toSelect)
      .expand(...toExpand)
      .filter(filterstring)
      .get()
      .then((res) => {
        console.log(res);
        if (res.length === 0) return null;
        let user = {} as IUser;
        const officeLocationCoordinates =
          res[0][usersListOfficeLocationCoordinatesColumn].split(",");

        user = {
          email: res[0][usersListTitleColumn]["EMail"],
          officeLocationCoordinates: {
            latitude: officeLocationCoordinates[0],
            longitude: officeLocationCoordinates[1],
          },
        };

        return user;
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service->getUserListItems",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return null;
      });

    return response;
  }

  public async saveListItem(
    webpartConfiguration: IWebpartConfiguration,
    attendanceListItem: IAttendanceListItem
  ): Promise<IAttendanceListItem> {
    const {
      attendanceListSiteURL,
      attendanceListName,
      attendanceListUserColumn,
      attendanceListTimeinColumn,
      attendanceListTimeoutColumn,
      attendanceListLocationCoordinatesColumn,
      attendanceListLocationLabelColumn,
    } = webpartConfiguration;
    const { userId, timein, locationCoordinates, locationLabel } =
      attendanceListItem;

    const web = Web(attendanceListSiteURL);

    const obj = {
      [attendanceListUserColumn + "Id"]: userId,
      [attendanceListTimeinColumn]: timein,
      [attendanceListLocationCoordinatesColumn]: locationCoordinates,
      [attendanceListLocationLabelColumn]: locationLabel,
    };

    const response = await web.lists
      .getByTitle(attendanceListName)
      .items.add(obj)
      .then((res) => {
        const item = res.data;
        // console.log(res);
        let itemObj = {} as IAttendanceListItem;

        itemObj = {
          id: item.Id,
          userId: parseInt(item[attendanceListUserColumn + "Id"]),
          timein: item[attendanceListTimeinColumn],
          timeout: item[attendanceListTimeoutColumn],
          locationCoordinates: item[attendanceListLocationCoordinatesColumn],
          locationLabel: item[attendanceListLocationLabelColumn],
        };

        // console.log(attendanceListItem);

        return itemObj;
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service->saveListItem",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return null;
      });

    return response;
  }

  public async updateListItem(
    webpartConfiguration: IWebpartConfiguration,
    attendanceListItem: IAttendanceListItem
  ): Promise<boolean> {
    const {
      attendanceListSiteURL,
      attendanceListName,
      attendanceListTimeinColumn,
      attendanceListTimeoutColumn,
    } = webpartConfiguration;
    const { id, timeout } = attendanceListItem;

    const web = Web(attendanceListSiteURL);

    const obj = {
      [attendanceListTimeinColumn]: attendanceListItem.timein,
      [attendanceListTimeoutColumn]: timeout,
    };

    const response = await web.lists
      .getByTitle(attendanceListName)
      .items.getById(id)
      .update(obj)
      .then((res) => {
        // console.log(res);
        return true;
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service->updateListItem",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return false;
      });

    return response;
  }
}

export default ListService;

// public async getListColumns(
//   siteURL: string,
//   listName: string
// ): Promise<IListColumn[]> {
//   let listColumns: IListColumn[] = [];
//   const web = Web(siteURL);
//   const list = web.lists.getByTitle(listName);
//   let viewType = "All Items";

//   try {
//     const listType = await list.select("BaseTemplate")();
//     if (listType.BaseTemplate === 106) {
//       viewType = "All Events";
//     }

//     const fields: IViewFields = await list.views
//       .getByTitle(viewType)
//       .fields();

//     let internames: string[] = (fields as any).Items;
//     let filterstring: string = internames
//       .map((x) => `(InternalName eq '${x}')`)
//       .join(` or `);

//     const result = await list.fields
//       .filter(filterstring)
//       .select("InternalName", "Title")
//       .get();

//     listColumns = result.map((item) => {
//       const listColumn: IListColumn = {} as IListColumn;

//       listColumn.title = item.Title;
//       listColumn.internalName = item.InternalName;
//       listColumn.type = item["odata.type"];

//       return listColumn;
//     });
//   } catch (error) {
//     console.log(error);
//   }

//   return listColumns;
// }
