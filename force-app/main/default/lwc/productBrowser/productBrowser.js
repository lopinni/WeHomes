import { LightningElement } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import noHeader from '@salesforce/resourceUrl/NoHeaderStylesheet';

export default class ProductBrowser extends LightningElement {

    constructor() {
        super();
        loadStyle(this, noHeader);
    }

}