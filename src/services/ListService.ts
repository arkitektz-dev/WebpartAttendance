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
import { IResult } from "../models/IResult";

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

    try {
      const response = await web.lists.filter(filterstring).get();
      lists = response.map((item) => {
        const list: IList = {} as IList;

        list.id = item.Id;
        list.title = item.Title;

        return list;
      });
    } catch (error) {
      console.log(
        "'Method Name': List Service --> getLists",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );
    }
    
    return lists;
    // const response = await web.lists
    //   .filter(filterstring)
    //   .get()
    //   .then((res) => {
    //     // console.log(res);
    //     lists = res.map((item) => {
    //       const list: IList = {} as IList;

    //       list.id = item.Id;
    //       list.title = item.Title;

    //       return list;
    //     });

    //     return lists;
    //   })
    //   .catch((error) => {
    //     console.log(
    //       "'Method Name': List Service --> getLists",
    //       "\n'Message':",
    //       error.message,
    //       "\n'Error':",
    //       error
    //     );
    //     return lists;
    //   });

    // return response;
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

      listColumns = fields.map((item) => {
        const listColumn: IListColumn = {} as IListColumn;
        listColumn.title = item["Title"];
        listColumn.internalName = item["InternalName"];
        listColumn.type = item["odata.type"];
        listColumn.dependentLookupInternalNames =
          item["DependentLookupInternalNames"];

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
  ): Promise<IResult> {
    const {
      attendanceListSiteURL,
      attendanceListName,
      attendanceListUserColumn,
      attendanceListTimeinColumn,
      attendanceListTimeoutColumn,
      attendanceListLocationLabelColumn,
      attendanceListLocationCoordinatesColumn,
      attendanceListPayCodeColumn,
    } = webpartConfiguration;
    try {
      const web = Web(attendanceListSiteURL);
      let filterstring = `${attendanceListUserColumn}/EMail eq '${
        this._currentUser
      }' and ${attendanceListTimeoutColumn} eq null and ${
        attendanceListPayCodeColumn + "Id"
      } eq '3'`;
      let toSelect: string[] = [
        "Id",
        attendanceListTimeinColumn,
        attendanceListTimeoutColumn,
        attendanceListLocationLabelColumn,
        attendanceListLocationCoordinatesColumn,

        `${attendanceListUserColumn}/Title`,
        `${attendanceListUserColumn}/EMail`,

        // `${attendanceListPayCodeColumn}/Id`,
      ];
      let toExpand: string[] = [
        attendanceListUserColumn,
        // attendanceListPayCodeColumn,
      ];

      const response: IResult = await web.lists
        .getByTitle(attendanceListName)
        .items.select(...toSelect)
        .expand(...toExpand)
        .filter(filterstring)
        .get()
        .then((res) => {
          console.log(res);
          if (res.length === 0)
            return {
              entity: null,
              errorDetails: null,
            };

          let attendanceListItem = {} as IAttendanceListItem;

          attendanceListItem = {
            id: res[0].Id,
            userId: null,
            timein: res[0][attendanceListTimeinColumn],
            timeout: null,
          };

          return {
            entity: attendanceListItem,
            errorDetails: null,
          };
        });
      return response;
    } catch (error) {
      console.log(
        "'Method Name': List Service->getAttendanceListItems",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );
      return {
        entity: null,
        errorDetails: {
          errorObj: error,
          clientMessage: "Configurations are not valid",
        },
      };
    }
  }

  public async getUserListItems(
    webpartConfiguration: IWebpartConfiguration
  ): Promise<IResult> {
    const {
      usersListSiteURL,
      usersListName,
      usersListTitleColumn,
      usersListOfficeLocationCoordinatesColumn,
      isOfficeLookupField,
    } = webpartConfiguration;

    try {
      const web = Web(usersListSiteURL);
      let filterstring = `${usersListTitleColumn}/EMail eq '${this._currentUser}'`;
      let toSelect: string[] = [`${usersListTitleColumn}/EMail`];

      let officeLookupInfo = null;
      if (isOfficeLookupField) {
        const officeLookUpArray =
          usersListOfficeLocationCoordinatesColumn.split("_x003a_");

        officeLookupInfo = {
          listName: officeLookUpArray[0],
          columnName: officeLookUpArray[1],
        };
      }

      if (officeLookupInfo) {
        toSelect.push(
          `${officeLookupInfo.listName}/${officeLookupInfo.columnName}`
        );
      } else {
        toSelect.push(usersListOfficeLocationCoordinatesColumn);
      }

      let toExpand: string[] = [usersListTitleColumn];
      if (isOfficeLookupField) {
        toExpand.push(officeLookupInfo.listName);
      }

      const response = await web.lists
        .getByTitle(usersListName)
        .items.select(...toSelect)
        .expand(...toExpand)
        .filter(filterstring)
        .get()
        .then((res) => {
          if (res.length === 0)
            return {
              entity: null,
              errorDetails: null,
            };

          let user = {} as IUser;
          user = {
            email: res[0][usersListTitleColumn]["EMail"],
          };

          if (
            officeLookupInfo
              ? res[0][officeLookupInfo.listName][officeLookupInfo.columnName]
              : res[0][usersListOfficeLocationCoordinatesColumn]
          ) {
            const officeLocationCoordinates = officeLookupInfo
              ? res[0][officeLookupInfo.listName][
                  officeLookupInfo.columnName
                ].split(",")
              : res[0][usersListOfficeLocationCoordinatesColumn].split(",");

            if (officeLocationCoordinates.length === 2) {
              user.officeLocationCoordinates = {
                latitude: officeLocationCoordinates[0],
                longitude: officeLocationCoordinates[1],
              };
            } else {
              user.officeLocationCoordinates = null;
            }
          } else {
            user.officeLocationCoordinates = null;
          }

          return {
            entity: user,
            errorDetails: null,
          };
        });

      return response;
    } catch (error) {
      console.log(
        "'Method Name': List Service --> getUserListItems",
        "\n'Message':",
        error.message,
        "\n'Error':",
        error
      );
      return {
        entity: null,
        errorDetails: {
          errorObj: error,
          clientMessage: "Configurations are not valid",
        },
      };
    }
  }

  public async saveListItem(
    webpartConfiguration: IWebpartConfiguration,
    attendanceListItem: IAttendanceListItem
  ): Promise<IResult> {
    const {
      attendanceListSiteURL,
      attendanceListName,
      attendanceListUserColumn,
      attendanceListTimeinColumn,
      attendanceListTimeoutColumn,
      attendanceListLocationCoordinatesColumn,
      attendanceListLocationLabelColumn,
      attendanceListPayCodeColumn,
    } = webpartConfiguration;
    const { userId, timein, locationCoordinates, locationLabel } =
      attendanceListItem;

    const web = Web(attendanceListSiteURL);

    const obj = {
      [attendanceListUserColumn + "Id"]: userId,
      [attendanceListTimeinColumn]: timein,
      [attendanceListLocationCoordinatesColumn]: locationCoordinates,
      [attendanceListLocationLabelColumn]: locationLabel,
      [attendanceListPayCodeColumn + "Id"]: 3,
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

        return {
          entity: itemObj,
          errorDetails: null,
        };
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service --> saveListItem",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return {
          entity: null,
          errorDetails: {
            errorObj: error,
            clientMessage: "Configurations are not valid",
          },
        };
      });

    return response;
  }

  public async updateListItem(
    webpartConfiguration: IWebpartConfiguration,
    attendanceListItem: IAttendanceListItem
  ): Promise<IResult> {
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
        return {
          entity: res.data,
          errorDetails: null,
        };
      })
      .catch((error) => {
        console.log(
          "'Method Name': List Service --> updateListItem",
          "\n'Message':",
          error.message,
          "\n'Error':",
          error
        );
        return {
          entity: null,
          errorDetails: {
            errorObj: error,
            clientMessage: "Configurations are not valid",
          },
        };
      });

    return response;
  }
}

export default ListService;
