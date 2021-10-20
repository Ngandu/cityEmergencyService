import { makeAutoObservable } from "mobx";

class ServiceStore {
  //observables
  service = "";
  selectedEmergency = [];

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
}

export default new ServiceStore();
