import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class VelomagService {
  URL = "http://velomag.chickenkiller.com:55555/";
  username: string = "";
  password: string = "";
  isAdmin: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {
    this.username = this.cookieService.get("username");
    this.password = this.cookieService.get("password");
    if (this.username.length > 0 && this.password.length > 0) {
      this.isAdmin = true;
    }
  }

  login(username: string, password: string) {
    return this.httpClient.post(this.URL + "login", { username, password });
  }

  saveLogin(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.cookieService.set("username", username);
    this.cookieService.set("password", password);
    this.isAdmin = true;
  }

  clearLogin() {
    this.username = "";
    this.password = "";
    this.cookieService.delete("username");
    this.cookieService.delete("password");
    this.isAdmin = false;
  }

  getBikes() {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.URL + "get_bikes").subscribe(
        (res: any) => {
          if (res["code"] == 200) {
            res["data"] = res["data"].map((bike: any) => {
              bike.data = {
                id: bike[0],
                id_bike: bike[1],
                priority: this.get_priority(bike[2]),
                reason: this.get_reason(bike[3]),
                description: bike[4],
                date: new Date(bike[5]),
              };
              return bike.data;
            });
            resolve(res);
          } else {
            reject(res["message"]);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  private get_priority(
    priority: "low" | "important" | "urgent"
  ): "Low" | "Important" | "Urgent" {
    if (priority == "low") {
      return "Low";
    } else if (priority == "important") {
      return "Important";
    } else {
      return "Urgent";
    }
  }

  private get_reason(
    reason:
      | "brake problem"
      | "gear problem"
      | "seat problem"
      | "touch panel not working"
      | "other"
  ):
    | "Brake problem"
    | "Gear problem"
    | "Seat problem"
    | "Touch panel not working"
    | "Other" {
    if (reason == "brake problem") {
      return "Brake problem";
    } else if (reason == "gear problem") {
      return "Gear problem";
    } else if (reason == "seat problem") {
      return "Seat problem";
    } else if (reason == "touch panel not working") {
      return "Touch panel not working";
    } else {
      return "Other";
    }
  }

  removeBike(id: number) {
    const username = this.username;
    const password = this.password;
    return this.httpClient.post(this.URL + "remove_bike/" + id.toString(), { username, password });
  }
}
