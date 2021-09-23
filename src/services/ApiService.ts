class ApiService {
  constructor() {}

  public async getUniversalDateTime() {
    try {
      const response = await fetch("https://worldtimeapi.org/api/ip");
      const data = await response.json();
      const { utc_datetime } = data;
      return utc_datetime;
    } catch (error) {
      return new Date();
    }
  }
}

export default ApiService;
