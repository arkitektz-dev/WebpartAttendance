export interface IWebpartConfiguration {
  usersListSiteURL: string;
  usersListName: string;
  usersListTitleColumn: string;
  usersListOfficeLocationCoordinatesColumn: string;
  usersListOfficeLatitudeColumn: string;
  usersListOfficeLongitudeColumn: string;

  attendanceListSiteURL: string;
  attendanceListName: string;
  attendanceListUserColumn: string;
  attendanceListTimeinColumn: string;
  attendanceListTimeoutColumn: string;
  attendanceListLocationCoordinatesColumn: string;
  attendanceListLocationLabelColumn: string;

  noLocationLabel: string;
  noOfficeLabel: string;
}
