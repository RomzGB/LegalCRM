alert("functions")

var displayedContracts = false

function addClient(){
    let clientName = $("#addClientName").val()
    $.post('/newClient', {clientName: clientName}, (data)=>{
        if(data)
        window.location.replace("http://localhost:5000/success")
    })
}

function addContract(clientName){
    let trimmedClientName = clientName.replace(/\s/g,'')
    let contractTitle =  $(`#${trimmedClientName}ContractTitleInput`).val()
   $.post('/addContract', {clientName: clientName, contractTitle: contractTitle}, (data)=>{
       if(data)
       window.location.replace("http://localhost:5000/success")
    })
}


function displayContracts(clientName){
    //retrieve information about contracts for a specific client from mongoDB
        $.post('/displayContracts', {clientName: clientName}, (data)=>{
            let trimmedClientNameForId = clientName.replace(/\s/g,'')

            if(!displayedContracts){
            
            let contractTitleInput = $("<input>", {     //create fields for adding additional contracts for this client
                type: "text",
                id: trimmedClientNameForId + "ContractTitleInput",
                placeholder: "הכנס כותרת חוזה"
            })

            let addContractButton = $("<button/>", {
               id:  trimmedClientNameForId + "AddContractButton",
               text: "הוסף חוזה חדש",
               click: function(){
                   addContract(clientName)
               }
            })

            //add those fields to the DIV made for that client
            $(`#divOf${trimmedClientNameForId}`).append([contractTitleInput, addContractButton, `<br id="lineAfter${trimmedClientNameForId}">`])

            //
            data.forEach((element, index)=>{
                if(element.name){
                let addAssignmentButton = $("<button/>", {
                    id: `addAssignmentToContract${element._id}`,
                    text: "הוסף מטלה",
                    click: function(){
                        addAssignment()
                }})
                let contractTitleButton = $("<button/>", {
                    id: element._id,
                    text: element.name,
                    click: function(){
                        displayAssignments(clientName, element._id)
                    }
                })

                $(`#lineAfter${trimmedClientNameForId}`).after(contractTitleButton, "<br>")

                displayedContracts = true}})
            }
            else{
                $(`#divOf${trimmedClientNameForId}`).empty()
                //$(`#${trimmedClientNameForId}AddContractButton`).remove()
                displayedContracts = false
            }})
    }



    function addAssignment(contractID){
        let assignmentText = $(`#assignmentTitleInput${contractID}`).val()
        let assignmentDate = $(`#dateForAssignment${contractID}`).val()
        alert(assignmentDate)
        let assignmentTitleButton = $("<button/>", {
            text: assignmentText,
            click: function(){
                editAssignmentTitle()
            }
        })
        let assignmentDateButton = $("<input/>", {
            type: "date",
            value: assignmentDate,
            click: function(){
                editAssignmentDate()
            }
        })
        $(`#lineafter${contractID}`).after(assignmentTitleButton, assignmentDateButton)
    }


    function displayAssignments(clientName, contractID){
        $.post('/displayAssignments', {clientName: clientName, contractID: contractID}, (data)=>{
            data.contracts.forEach((element, index)=>{
                if(contractID === element._id){
                let datePickerForAssignment = $("<input>", {
                    type: "date",
                    id: `dateForAssignment${contractID}`
                })
                let assignmentTitleInput = $("<input>", {
                    type: "text",
                    placeholder: "הקלד תוכן מטלה", 
                    id: `assignmentTitleInput${contractID}`
                })
                let addAssignmentButton = $("<button/>", {
                    text: "הוסף מטלה לחוזה זה", 
                    id: `addNewAssignmentToContract${contractID}`,
                    click: function(){
                        //alert(contractID)
                        addAssignment(contractID)
                    }
                })
                $(`#${contractID}`).after(datePickerForAssignment, assignmentTitleInput, addAssignmentButton, `<br id="lineafter${contractID}">`)
            }})
        })
    }