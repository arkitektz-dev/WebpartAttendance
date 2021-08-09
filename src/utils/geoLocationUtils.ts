export function getCurrentCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject("Some error occured");

    navigator.geolocation.getCurrentPosition(
      (res) => {
        const { coords } = res;
        const { latitude, longitude } = coords;

        resolve({
          latitude,
          longitude,
        });
      },
      (error) => {
        const { message } = error;
        reject(message);
      }
    );
  });
}

export function calculateDistance(coordinates) {
  const { latitude1, longitude1, latitude2, longitude2 } = coordinates;

  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((latitude2 - latitude1) * p) / 2 +
    (c(latitude1 * p) *
      c(latitude2 * p) *
      (1 - c((longitude2 - longitude1) * p))) /
      2;

  return 12742 * Math.asin(Math.sqrt(a)); // R = 6371 km; 2 * R = 12742;
}