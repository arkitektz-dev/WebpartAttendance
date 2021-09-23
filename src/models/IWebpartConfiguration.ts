export interface IWebpartConfiguration {
  usersListSiteURL: string;
  usersListName: string;
  usersListTitleColumn: string;
  isOfficeLookupField: boolean;
  usersListOfficeLocationCoordinatesColumn: string;

  attendanceListSiteURL: string;
  attendanceListName: string;
  attendanceListUserColumn: string;
  attendanceListTimeinColumn: string;
  attendanceListTimeoutColumn: string;
  attendanceListLocationCoordinatesColumn: string;
  attendanceListLocationLabelColumn: string;
  attendanceListPayCodeColumn: string;

  noLocationLabel: string;
  noOfficeLabel: string;
}
