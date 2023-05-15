global class AutocreatedRegHandler1669974250155 implements Auth.RegistrationHandler{

    private static final String ORG_SUFFIX = '.sso.weHomes.org';
    private static final String EXTERNAL_USER_PROFILE = 'Partner User';
    private static final String INTERNAL_USER_PROFILE = 'System Administrator';
    private static final String TZSID = [
        SELECT TimeZoneSidKey FROM User WHERE Profile.Name = 'System Administrator' LIMIT 1
    ].timeZoneSidKey;

    global void updateUser(Id userId, Id portalId, Auth.UserData data) {
        User u = new User(id=userId);
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        update(u);
    }

    global User createUser(Id portalId, Auth.UserData data){
        if(!canCreateUser(data)) {
            return null;
        }
        if(isCommunityContext(data)) {
            Id accountId = createAccount(data);
            Profile p = [
                SELECT Id FROM profile WHERE name=:EXTERNAL_USER_PROFILE WITH SECURITY_ENFORCED
            ];
            User u = createUser(data, p);
            Id contactId = [
                SELECT Id FROM Contact WHERE AccountId=:accountId WITH SECURITY_ENFORCED
            ].Id;
            u.contactId = contactId;
            return u;
        } else {
            User u = new User();
            Profile p = [
                SELECT Id FROM profile WHERE name=:INTERNAL_USER_PROFILE WITH SECURITY_ENFORCED
            ];
            return createUser(data, p);
        }
    }

    global boolean canCreateUser(Auth.UserData data) {
        Boolean retVal = (data != null 
                && data.email != null
                && data.lastName != null
                && data.firstName != null);
        return retVal;
    }

    private Boolean isCommunityContext(Auth.UserData data) {
        if(data.attributeMap.containsKey('sfdc_networkid')) {
            return true;
        } else {
            return false;
        }
    }

    private Id createAccount(Auth.UserData data){        
        Account newAcc = new Account();
        newAcc.Firstname = data.firstName;
        newAcc.LastName = data.lastName;
        insert newAcc;
        return newAcc.Id;
    }

    private User createUser(Auth.UserData data, Profile p) {
        User u = new User();
        u.communityNickname = data.email;
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
        u.timeZoneSidKey = TZSID;
        u.profileId = p.Id;
        return u;
    }

}