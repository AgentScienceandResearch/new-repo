// Simple Tesla App Demo
class TeslaApp {
  constructor() {
    this.vehicleStatus = { battery: 85, range: 320, temperature: 22 };
  }
  getStatus() {
    return this.vehicleStatus;
  }
}

const app = new TeslaApp();
console.log('Tesla App Status:', app.getStatus());