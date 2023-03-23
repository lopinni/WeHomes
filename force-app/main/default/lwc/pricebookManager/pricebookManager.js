import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import { loadStyle } from "lightning/platformResourceLoader";
import noHeader from '@salesforce/resourceUrl/NoHeaderStylesheet';

import getPricebooks from "@salesforce/apex/WH_PricebookManagerController.getPricebooks";
import getAllProducts from "@salesforce/apex/WH_PricebookManagerController.getAllProducts";

const pricebookActions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

const pricebookColumns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Description', fieldName: 'Description' },
    { label: 'Active', fieldName: 'IsActive', type: 'boolean' },
    { label: 'Standard', fieldName: 'IsStandard', type: 'boolean' },
    {
        type: 'action',
        typeAttributes: { rowActions: pricebookActions },
    },
];

export default class PricebookManager extends NavigationMixin(LightningElement) {

    pricebookData = [];
    productData = [];
    pricebookColumns = pricebookColumns;

    constructor() {
        super();
        loadStyle(this, noHeader);
    }

    @wire(getPricebooks)
    populatePricebookTable(value) {
        const { data, error } = value;
        if (data) {
            console.log(data);
            this.pricebookData = data;
        } else if (error) {
            console.log(error);
        }
    }

    @wire(getAllProducts)
    populateProductTable(value) {
        const { data, error } = value;
        if (data) {
            console.log(data);
            this.productData = data;
        } else if (error) {
            console.log(error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const rowId = event.detail.row.Id;
        switch (actionName) {
            case 'view':
                this.navigateToRecordPage(rowId);
                break;
            default:
        }
    }

    navigateToRecordPage(rowId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rowId,
                objectApiName: 'Pricebook2',
                actionName: 'view'
            }
        });
    }

}