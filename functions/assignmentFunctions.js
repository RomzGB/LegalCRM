function deleteAssignment(assignmentID, contractID, assignmentName) {
    let deleteAssignment = confirm(` למחוק את המטלה ${assignmentName}`, "confirm")
    if (deleteAssignment) {
        $.post('/assignments/deleteAssignment', { assignmentID, contractID }, (data) => {
        })
    }
    $(`#${assignmentID}`).remove()
}

function addAssignment(contractID) {
    let assignmentID
    let clientName = $(`#${contractID}`).data('clientname')
    let contractName = $(`#${contractID}`).data('contractname')
    let assignmentText = $(`#assignmentTitleInput${contractID}`).val() + " " + clientName + " " + contractName
    let assignmentDate = $(`#dateForAssignment${contractID}`).val()
    let numbersOfDaysBeforeEventForNotification = $(`#numbersOfDaysBeforeEventForNotification${contractID}`).val()
    $.post('/assignments/addAssignment', { assignmentText, assignmentDate, contractID }, (data) => {
        assignmentID = data
    })
    let assignmentName = $("<button/>", {
        text: `${assignmentText} ${assignmentDate}`,
        class: 'btn btn-danger',
        id: assignmentID,
        click: function () {
            deleteAssignment(assignmentID, contractID, assignmentName)
        }
    })
    $(`#divOf${contractID}`).append(assignmentName)
    addEvent(assignmentDate, assignmentText, numbersOfDaysBeforeEventForNotification)
    setTimeout(() => {
        $(`#divOf${contractID}`).empty()
        addAssignmentInputFields(clientName, contractID)
        displayedAssignments = false
        displayAssignments(clientName, contractID)
    }, 1000)

}

var displayedAssignments = false
var displayedAssignmentsFields = false

function addAssignmentInputFields(clientName, contractID) {
    let placeholder = $(`#assignmentTitleInput${contractID}`).attr('placeholder')
    if (!placeholder) {
        let datePickerForAssignment = $("<input>", {
            type: "datetime-local",
            id: `dateForAssignment${contractID}`
        })
        let numbersOfDaysBeforeEventForNotification = $("<input>", {
            type: 'number',
            width: '275px',
            placeholder: '?כמה ימים לפני תרצה לקבל התראה',
            id: `numbersOfDaysBeforeEventForNotification${contractID}`
        })
        let assignmentTitleInput = $("<input>", {
            type: "text",
            placeholder: "הקלד תוכן מטלה",
            id: `assignmentTitleInput${contractID}`
        })
        let addAssignmentButton = $("<button/>", {
            text: "הוסף מטלה לחוזה זה",
            class: 'btn btn-outline-success',
            id: `addNewAssignmentToContract${contractID}`,
            click: function () {
                addAssignment(contractID)
            }
        })

        $(`#divOf${contractID}`).append(numbersOfDaysBeforeEventForNotification, datePickerForAssignment, "בחר תאריך מטלה", assignmentTitleInput, addAssignmentButton, `<br id="lineafter${contractID}">`)
        displayedAssignmentsFields = true
    }
    else {
        displayedAssignmentsFields = false
        $(`#divOf${contractID}`).empty()
    }
}


function displayAssignments(clientName, contractID) {
    let placeholder = $(`#assignmentTitleInput${contractID}`).attr('placeholder')
    if (placeholder) {
        $.post('/assignments/displayAssignments', { clientName, contractID }, (data) => {
            data.forEach((element, index, array) => {
                let assignmentName = $("<button/>", {
                    text: `${element.name} ${element.date.substring(0, 10)}`,
                    class: 'btn btn-success',
                    id: element._id,
                    click: function () {
                        deleteAssignment(element._id, contractID, element.name)
                    }
                })
                $(`#divOf${contractID}`).append(assignmentName, "<br>")
            })
        })
        displayedAssignments = true
    }
    else {
        displayedAssignments = false
        $(`#divOf${contractID}`).empty()
    }
}
// function displayAssignments2(clientName, contractID) {
//     if (!displayedAssignments) {
//         $.post('/assignments/displayAssignments', { clientName, contractID }, (data) => {
//             data.forEach((element, index, array) => {
//                 let assignmentName = $("<button/>", {
//                     text: `${element.name} ${element.date.substring(0, 10)}`,
//                     class: 'btn btn-danger',
//                     id: element._id,
//                     click: function () {
//                         deleteAssignment(element._id, contractID, element.name)
//                     }
//                 })
//                 $(`#divOf${contractID}`).append(assignmentName, "<br>")
//             })
//         })
//         displayedAssignments = true
//     }
//     else {
//         displayedAssignments = false
//         $(`#divOf${contractID}`).empty()
//     }
// }


var areDisplayAllAssignmentsPressed = false

function displayAllAssignments() {

    let length = $('#1').text().length
    if (length === 0 && !areDisplayAllAssignmentsPressed) {
        $.post('/assignments/displayAllAssignments', {}, (data) => {
            let arrayOfAllAssignments = []
            data.forEach((client) => {
                client.contracts.forEach((contract) => {
                    contract.assignments.forEach((assignment, index) => {
                        let assignmentDateFormat = new Date(assignment.date.substring(0, 10))
                        let todaysDate = new Date()
                        let assignmentText = $('<li/>', {
                            id: index,
                            alignitems: 'center',
                            width: '300',
                            height: '100',
                            class: 'list-group-item list-group-item-primary',
                            text: `${assignment.name} ${assignment.date.substring(0, 10)}`
                        })
                        arrayOfAllAssignments.push([assignmentText, assignmentDateFormat])
                    })
                })
            })
            arrayOfAllAssignments.sort(function (elementA, elementB) {
                if (elementA[1] < elementB[1])
                    return -1
                else if (elementB[1] > elementA[1])
                    return 1
                else {
                    return 0
                }
            })
            arrayOfAllAssignments.forEach((element) => {

                $('#ulOfAllAssignments').append(element[0], '<br>')
            })
            $('#displayAllAssignments').text('הסתר את כל המטלות')

        })
        areDisplayAllAssignmentsPressed = true
    }
    else {
        areDisplayAllAssignmentsPressed = false
        $('#ulOfAllAssignments').empty()
        $('#displayAllAssignments').text('הצג את כל המטלות')
    }
}

