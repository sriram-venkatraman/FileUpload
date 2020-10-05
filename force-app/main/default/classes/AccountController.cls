public without sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [SELECT Id, Name FROM Account WITH SECURITY_ENFORCED LIMIT 10];
    }

    @AuraEnabled(cacheable=true)
    public static Account findAccount(String email) {
        system.debug('Email: ' + email);
        if (email == null || email == '') {
            throw new AccountException('Email can\'t be blank');
        }
        List<Account> a = [
            SELECT Id, Name, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, PersonEmail, PersonMobilePhone
            FROM Account
            WHERE PersonEmail = :email
            WITH SECURITY_ENFORCED
        ];

        if (a.size() <= 0 ) {
            throw new AccountException('Unable to validate with information provided');
        }
        if (a.size() > 1 ) {
            throw new AccountException('Duplicates found');
        }

        return a[0];
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getUploadedDocs(String accountId) {
        system.debug('AccountId: ' + accountId);
        if (accountId == null || accountId == '') {
            throw new AccountException('Valid Account has not be identified');
        }
        List<ContentVersion> cv = [
            SELECT Id, Title, PathOnClient
            FROM ContentVersion
            WHERE Guest_Record_fileupload__c = :accountId
        ];
        system.debug('Doc List: ' + cv);

        return cv;
    }

    public class AccountException extends Exception {}
}