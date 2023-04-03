export const getLocation = () => {
  return new Promise<{ lat: number; lng: number } | null>(
    async (resolve, reject) => {
      if (
        (await window.navigator.permissions.query({ name: 'geolocation' }))
          .state === 'denied'
      ) {
        reject(null);
      } else {
        window.navigator.geolocation.getCurrentPosition(
          (location) => {
            resolve({
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            });
          },
          (err) => {
            reject(null);
          }
        );
      }
    }
  );
};
