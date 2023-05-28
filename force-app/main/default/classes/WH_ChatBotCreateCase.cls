public class WH_ChatBotCreateCase {  
 
    public class Output { 
     
        @InvocableVariable(required=true)
        public Id newCaseId;

    } 
     
    public class Input { 
     
        @InvocableVariable(required=true) 
        public String description;

        @InvocableVariable(required=true) 
        public String type; 

        @InvocableVariable(required=true) 
        public String subject;

        @InvocableVariable(required=true) 
        public String contact;
         
    } 
 
    @InvocableMethod(label='Create Case') 
    public static List<Output> fetchCaseStatus(List<Input> listCaseInputs) {
        Case newCase = new Case();
        newCase.Subject = listCaseInputs[0].subject;
        newCase.Type = listCaseInputs[0].type;
        newCase.Description = listCaseInputs[0].description;
        newCase.ContactId = listCaseInputs[0].contact;
        try {
            insert newCase;
        } catch(Exception e) {
            WH_HandleException.logException(e);
        }
        List<Output> outputs = new List<Output>(); 
        Output output = new Output();
        output.newCaseId = newCase.Id;
        outputs.add(output);
        return outputs;
    } 
 
}