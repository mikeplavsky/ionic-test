import { Component } from '@angular/core';
import { Page1 } from '../../pages/page1/page1';

import { NavController, NavParams } from 'ionic-angular';
import { UserLoginService } from "../../services/account-management.service";

declare const AWS: any;

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {

  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  getItems(){

    let s3 = new AWS.S3();
    
    let params = {
        Bucket: "mp-web-logs"
    };

    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];

    s3.listObjectsV2(params, (err,data) => {
        
        if (err) {
            console.log(err);
            return;
        }

        let objects = data.Contents;

        objects.forEach((obj)=>{

            this.items.push({
              title: obj.Key,
              note: 'This is item #',
              icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            });

        })

    });
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    UserLoginService.getAwsCredentials().then(()=>{
        console.log("got credentials.");
        this.getItems();
    }).
    catch((err)=>{
        console.log(err);
    });    

  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(Page1, {
      item: item
    });
  }
}
