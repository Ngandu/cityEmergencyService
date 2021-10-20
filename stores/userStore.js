import { makeAutoObservable } from "mobx";

class UserStore {
  //observables
  user = {};
  loggedIn = false;

  constructor() {
    makeAutoObservable(this);
  }

  // actions
  setUser(user) {
    console.log("setUser");
    this.user = user;
    this.loggedIn = true;
  }

  // setLogin
  setLogout() {
    console.log("setLogout");
    this.user = {};
    this.loggedIn = false;
  }
}

export default new UserStore();
