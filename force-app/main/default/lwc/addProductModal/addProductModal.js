import { LightningElement, api } from 'lwc';

import CLOSE from '@salesforce/label/c.Close';
import ADD_PRODUCTS from '@salesforce/label/c.Add_Products';

import insertProductsToPriceBook from "@salesforce/apex/WH_PricebookManagerController.insertProductsToPriceBook";

const columns = [
    { label: 'Product Name', fieldName: 'Name' },
];

export default class AddProductModal extends LightningElement {

    label = {
        CLOSE,
        ADD_PRODUCTS
    };

    columns = columns;

    draftValues;

    @api show;
    @api priceBookId;
    @api productData;

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    addProducts() {
        let selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();
        insertProductsToPriceBook({
            priceBookId: this.priceBookId,
            products: selectedRecords
        }).then(() => {
            this.dispatchEvent(new CustomEvent('success'));
        }).catch(error => {
            this.dispatchEvent(new CustomEvent('error'));
        });
    }

}