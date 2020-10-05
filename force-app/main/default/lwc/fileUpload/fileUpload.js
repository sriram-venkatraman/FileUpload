import { LightningElement, track} from 'lwc';
//Importing reusable LWC Component as Javascript utility
import { getUrlParameter } from 'c/jSUtility';

import findAccount from '@salesforce/apex/AccountController.findAccount';
import getUploadedDocs from '@salesforce/apex/AccountController.getUploadedDocs';

export default class FileUpload extends LightningElement {
    constructor() {
        super();
    }

    account;
    documents;
    @track documentList = [];
    
    firstName = '';
    lastName = '';
    name = '';
    email = '';
    applicationNo = '';
    street = '';
    city = '';
    state = '';
    zip = '';
    country = '';
    phone = '';
    error;
    validated = false;

    get encryptedToken() {
        return this.account.Id; 
    }

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    connectedCallback() {
        //Note - We are NOT using "this" keyword to access method getUrlParameter
        this.applicationNo = getUrlParameter('ApplicationNo');
        console.log('Found Parameter value for ApplicationNo' + this.applicationNo);
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        console.log("No. of files uploaded : " + uploadedFiles.length);
        for (let i = 0; i < uploadedFiles.length; i++) {
            console.log("File " + i + ": " + uploadedFiles[i].name);
            this.documentList.push(uploadedFiles[i].name);
        }
    }

    handleChange(event) {
        const field = event.target.name;
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        } else if (field === 'email') {
            this.email = event.target.value;
        } else if (field === 'applicationNo') {
            this.applicationNo = event.target.value;
        }
    }

    handleButtonClick() {
        console.log('Email: ' + this.email);
        findAccount({ email: this.email })
            .then((result) => {
                    this.account = result;
                    this.firstName = this.account.FirstName;
                    this.lastName = this.account.LastName;
                    this.street = this.account.ShippingStreet;
                    this.city = this.account.ShippingCity;
                    this.state = this.account.ShippingState;
                    this.country = this.account.ShippingCountry;
                    this.zip = this.account.ShippingPostalCode;
                    this.phone = this.account.PersonMobilePhone;
                    this.email = this.account.PersonEmail;
                    this.name = this.account.Name;
                    this.error = undefined;
                    this.validated = true;
                    console.log(this.account.Id);
                    this.recordId = this.account.Id;
                    getUploadedDocs({ accountId: this.account.Id })
                            .then((result) => {
                                this.documents = result;
                                console.log('Docs: ' + this.documents);
                            });
                })
            .catch((error) => {
                this.error = error;
                this.account = undefined;
                console.log(this.error);
            });
    }

}