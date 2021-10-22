import { makeAutoObservable } from "mobx";

class ServiceStore {
  //observables
  service = "";
  selectedEmergency = [];
  location = {};

  constructor() {
    makeAutoObservable(this);
  }

  // actions
  setService(serv) {
    console.log("setService");
    this.service = serv;
  }

  setEmergency(emg) {
    console.log("setEmergency");
    this.selectedEmergency = emg;
  }

  setLocation(lc) {
    console.log("setEmergency");
    this.location = lc;
  }
}

export default new ServiceStore();
