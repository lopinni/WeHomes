global class AutocreatedRegHandler1669974250155 implements Auth.RegistrationHandler{

    private static final String ORG_SUFFIX = '.sso.badge.org';
    private static final String DEFAULT_ACCOUNTNAME = 'Partners';
    private static final String EXTERNAL_USER_PROFILE = 'Partner';
    private static final String INTERNAL_USER_PROFILE = 'System Administrator'; 

    global void updateUser(Id userId, Id portalId, Auth.UserData data) {
        User u = new User(id=userId);
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        update(u);
    }

    global User createUser(Id portalId, Auth.UserData data) {
        if(!canCreateUser(data)) {
            return null;
        }
        createPersonAccount(data);
        if(data.attributeMap.containsKey('sfdc_networkid')) {
            Id contactId;
            contactId = createContact(data);
            Profile p = [
                SELECT Id FROM profile WHERE name=:EXTERNAL_USER_PROFILE WITH SECURITY_ENFORCED
            ];
            User u = createUser(data,p);
            u.contactId = contactId;
            return u;
        } else {
            Profile p = [
                SELECT Id FROM profile WHERE name=:INTERNAL_USER_PROFILE WITH SECURITY_ENFORCED
            ];
            User u = createUser(data,p);
            return u;
        }
    }

    global boolean canCreateUser(Auth.UserData data) {
        Boolean retVal = (data != null 
                && data.email != null
                && data.lastName != null
                && data.firstName != null);
        return retVal;
    }

    private void createPersonAccount(Auth.UserData data) {
        Id personAccountRecordTypeId =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('PersonAccount').getRecordTypeId();
        Account newPersonAccount = new Account();
        newPersonAccount.FirstName = data.firstName;
        newPersonAccount.LastName = data.lastName;
        newPersonAccount.PersonEmail = data.email;
        newPersonAccount.RecordTypeId = personAccountRecordTypeId;
        insert newPersonAccount;
    }

    private Id createContact(Auth.UserData data) {
        Contact contact = new Contact();
        contact.LastName = data.lastName;
        contact.FirstName = data.firstName;
        contact.Email = data.email;
        if (data.attributemap.get('accountId') != null){
            contact.accountId = data.attributemap.get('accountId');
        } else {
            List<Account> accounts = [
                SELECT Id FROM Account WHERE Name =:DEFAULT_ACCOUNTNAME WITH SECURITY_ENFORCED
            ];
            contact.accountId = accounts[0].Id;         
        }
        insert contact;
        return contact.id; 
    }

    private User createUser(Auth.UserData data, Profile p) {
        User u = new User();
        u.username = data.email + ORG_SUFFIX;
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        String alias = data.firstName + data.lastName;
        //Alias must be 8 characters or less
        if(alias.length() > 8) {
            alias = alias.substring(0, 8);
        }
        u.alias = alias;
        u.languagelocalekey = UserInfo.getLanguage();
        u.localesidkey = UserInfo.getLocale();
        u.emailEncodingKey = 'UTF-8';
        u.timeZoneSidKey = 'America/Los_Angeles';
        u.profileId = p.Id;
        return u;
    }

}