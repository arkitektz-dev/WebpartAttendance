export const ConfigurationFileInfo = {
  name: "arkitektz-attendance-webpart-configuration",
  extension: ".json",
  fullPath:
    "/SiteAssets/Arkitektz/arkitektz-attendance-webpart-configuration.json",
  nameWithExt: "arkitektz-attendance-webpart-configuration.json",
  uploadPath: "/SiteAssets/Arkitektz",
  folderName: "Arkitektz",
};

export const LogFileInfo = {
  name: "arkitektz-attendance-webpart-logs",
  extension: ".txt",
  fullPath: "/SiteAssets/Arkitektz/arkitektz-attendance-webpart-logs.txt",
  nameWithExt: "arkitektz-attendance-webpart-logs.txt",
  uploadPath: "/SiteAssets/Arkitektz",
};

export const WebpartConfiguration = {
  usersListSiteURL: "https://abczxc.sharepoint.com/",
  usersListName: "Users",
  usersListTitleColumn: "User",
  isOfficeLookupField: true,
  officeLookup: "LookupOffice/Location",
  usersListOfficeLocationCoordinatesColumn: "Location",

  attendanceListSiteURL: "https://abczxc.sharepoint.com/",
  attendanceListName: "Attendance",
  attendanceListUserColumn: "User",
  attendanceListTimeinColumn: "EventDate",
  attendanceListTimeoutColumn: "EndDate",
  attendanceListLocationCoordinatesColumn: "Location",
  attendanceListLocationLabelColumn: "From",

  noLocationLabel: "no location service enabled",
  noOfficeLabel: "no office assigned to this user.",
};
