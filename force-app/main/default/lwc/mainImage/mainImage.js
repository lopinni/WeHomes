import { LightningElement, api, wire, track } from 'lwc';
import getURL from "@salesforce/apex/WH_LocationController.getURL";

export default class MainImage extends LightningElement {

    @api recordId;
    @track URL;

    @wire(getURL, { recordId: "$recordId" })
    fileResponse(value) {
        const { data, error } = value;
        if (data) {
            this.URL = data[0].DisplayUrl;
            this.loaded = true;
        } else if (error) {
            console.log(error);
        }
    }
}