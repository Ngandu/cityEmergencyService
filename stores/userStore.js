import { makeAutoObservable } from "mobx";

class UserStore {
  //observables
  user = {};
  loggedIn = false;
  prodiverDetails = {};

  constructor() {
    makeAutoObservable(this);
  }

  // actions
  setUser(user) {
    console.log("setUser");
    this.user = user;
    this.loggedIn = true;
  }

  // actions
  setProdiverDetails(user) {
    console.log("setProdiverDetails");
    this.prodiverDetails = user;
  }

  // setLogin
  setLogout() {
    console.log("setLogout");
    this.user = {};
    this.loggedIn = false;
  }
}

export default new UserStore();
