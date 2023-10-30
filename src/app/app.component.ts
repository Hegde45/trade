import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trade-ui';

  chart: any = []

  message: string = '';
  messages: string[] = [];
  req_token = ''
  api_key = "c2o7ubtktyf2qh4g"
  api_secret = "ovkwvz7lyxssn20qd7bi489vwdy98fc0"
  // # request_token = b83ogvGGOpNR1UNlStY7En14Hn1nSscL
  login_url= "https://kite.zerodha.com/connect/login?api_key=c2o7ubtktyf2qh4g&v=3"

  constructor(public websocketService: WebsocketService) {
    // this.websocketService.connect();
    window.open(this.login_url, "_blank");
  }

  login() {
    var KiteConnect = require("kiteconnect").KiteConnect;

    var kc = new KiteConnect({
      api_key: this.api_key
    });

    kc.generateSession(this.req_token, this.api_secret)
      .then(function (response: any) {
        init();
      })
      .catch(function (err: any) {
        console.log(err);
      });

    function init() {
      // Fetch equity margins.
      // You can have other api calls here.
      kc.getMargins()
        .then(function (response: any) {
          // You got user's margin details.
          console.log(response)
        }).catch(function (err: any) {
          // Something went wrong.
        });
    }

  }
  sendMessage(message: string) {
    this.websocketService.sendMessage(message);
  }

  ngOnDestroy() {
    this.websocketService.close();
  }

  ngOnInit(): void {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
