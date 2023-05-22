import { LightningElement } from 'lwc';

import WEHOMES_LOGO from '@salesforce/resourceUrl/WeHomesLogoDark';

import CONTACT_INFORMATION from '@salesforce/label/c.Contact_Information';
import EMAIL from '@salesforce/label/c.Email';
import PHONE from '@salesforce/label/c.Phone';
import COPYRIGHT from '@salesforce/label/c.Copyright';

export default class CustomFooter extends LightningElement {

    logoUrl = WEHOMES_LOGO;

    labels = {
        CONTACT_INFORMATION,
        EMAIL,
        PHONE,
        COPYRIGHT
    };

}