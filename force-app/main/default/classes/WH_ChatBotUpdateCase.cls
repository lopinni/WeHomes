public with sharing class WH_ChatBotUpdateCase {

    public class Input { 

        @InvocableVariable(required=true) 
        public String contact;
         
    } 

    @InvocableMethod(label='Close Case') 
    public static void closeCase(List<Input> listCaseInputs) {
        Case existingCase = [SELECT Id FROM Case WHERE Id =: listCaseInputs[0].contact][0];
        existingCase.Status = 'Closed';
        try {
            update existingCase;
        } catch(Exception e) {
            WH_HandleException.logException(e);
        }
    } 
}