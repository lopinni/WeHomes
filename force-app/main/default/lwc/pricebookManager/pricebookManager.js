import { LightningElement } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import noHeader from '@salesforce/resourceUrl/NoHeaderStylesheet';

export default class PricebookManager extends LightningElement {

    constructor() {
        super();
        loadStyle(this, noHeader);
    }

}