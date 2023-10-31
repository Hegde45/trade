import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ChartJSService {

    data = {
        top_gainers: [],
        top_losers: [],
        active_gainers: [],
        active_losers: [],
    }
    constructor() {

    }
}