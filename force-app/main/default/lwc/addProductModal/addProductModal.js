import { LightningElement, api, wire, track } from 'lwc';

import getAllProducts from "@salesforce/apex/WH_PricebookManagerController.getAllProducts";
import insertProductsToPriceBook from "@salesforce/apex/WH_PricebookManagerController.insertProductsToPriceBook";

const columns = [
    { label: 'Product Name', fieldName: 'Name' },
];

export default class AddProductModal extends LightningElement {

    columns = columns;

    @track refreshProductData;
    @track productData;

    draftValues;

    @api show;
    @api priceBookId;

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    @wire(getAllProducts)
    populatePricebookTable(value) {
        this.refreshProductData = value;
        const { data, error } = value;
        if (data) {
            console.log(data);
            this.productData = data;
        } else if (error) {
            console.log(error);
        }
    }

    addProducts() {
        let selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();
        insertProductsToPriceBook({
            priceBookId: this.priceBookId,
            products: selectedRecords
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
        });
    }

}