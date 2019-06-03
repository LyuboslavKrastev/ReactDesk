// Pass the checkbox name to the function
const getCheckedBoxes = (chkboxName) => {
        var checkboxes = document.getElementsByName(chkboxName);
        var checkboxesChecked = [];
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            // And stick the checked ones onto an array...
            if (checkboxes[i].checked) {
                checkboxesChecked.push(checkboxes[i].value);
            }
        }
        // Return the array if it is non-empty, or null
        return checkboxesChecked.length > 0 ? checkboxesChecked : null;
    }

export default getCheckedBoxes;