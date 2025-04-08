import { ShipWayTracking, Trackings } from "./modules/trackings";

class Tracker {
  trackings: Trackings;
  constructor(apiKey: string) {
    this.trackings = new Trackings(apiKey);
  }
}

class ShipWayTracker {
  trackings: ShipWayTracking;
  constructor(username: string, password: string) {
    this.trackings = new ShipWayTracking(username, password);
  }
}

export { ShipWayTracker, Tracker };
