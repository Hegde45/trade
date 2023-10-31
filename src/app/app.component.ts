import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { ChartJSService } from './chartjs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  stockList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  quantity = '';

  stocks = [
    { names:[], quantity: 10 }
  ]
  top_gainers_ticks: any[] = [];

  login() {
  }

  add() {
    this.stocks.unshift({
      names: [],
      quantity: this.stocks[0].quantity
    })
  }

  message: string = '';
  messages: string[] = [];
  req_token = ''
  api_key = "c2o7ubtktyf2qh4g"
  api_secret = "ovkwvz7lyxssn20qd7bi489vwdy98fc0"
  // # request_token = b83ogvGGOpNR1UNlStY7En14Hn1nSscL
  login_url= "https://kite.zerodha.com/connect/login?api_key=c2o7ubtktyf2qh4g&v=3"

  tick_num = 0;

  constructor(public ws: WebsocketService, private cdRef: ChangeDetectorRef,
    public cs: ChartJSService) {
  }

  ngOnInit(): void {

    // window.open(this.login_url, "_blank");

    this.top_gainers();
    setInterval(() => {
      // date.setDate(date.getDate() + 1);
      // chart.series[0].addPoint([`${date.getDate()}/${date.getMonth() + 1}`, this.getRandomNumber(0, 1000)], true, true);
      this.top_gainers();
    }, 5000);
  }

  ngOnDestroy() {
    // this.ws.close();
  }

  initial: boolean = false;
  top_gainers(initial: boolean = false) {
    this.ws.markets(this.tick_num).subscribe((res: any) => {
      // res.data = JSON.parse(res.data)
      if(res.data.length > 0) {
        this.top_gainers_ticks = res.data;
        this.cs.data.top_gainers = this.cs.data.top_gainers.concat(res.data);
        this.tick_num = Math.max.apply(null, res.data[0].values.map((x: any) => x.tick_num));
        this.cdRef.detectChanges();
        if(!initial) {
          this.initial = true;
        }
      }
    })
  }
}

