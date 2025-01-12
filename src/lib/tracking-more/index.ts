import Trackings from "./modules/trackings";

class Tracker {
  trackings: Trackings;
  constructor(apiKey: string) {
    this.trackings = new Trackings(apiKey);
  }
}

export default Tracker;
