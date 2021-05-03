/**
 * Return filtered selected items from Form
 *
 * @param {object} eventData unfiltered event data from Form Object
 * @return {object} filtered selected data 
 */
function getSelectedData(eventData) {
    const data = new FormData(eventData);
    const items = Object.fromEntries(data.entries());
    let selectedItems = [];

    for (let key in items) {
        if (items.hasOwnProperty(key)) {
            selectedItems.push(JSON.parse(items[key]));
        }
    }

    return selectedItems;
}

/**
 * Return validation status of selected items
 *
 * @param {object} items
 * @return {boolean} 
 */
function selectedItemsValidation(items) {
    let currentWeight = items.reduce((total, item) => {
        return total + item.weight;
    }, 0)

    if (items.length % 2 !== 0) {
        alert("Selected items must be even number")
        return false;
    }

    if (currentWeight < 400) {
        alert("Selected Items must have overall weight higher than 400 !")
        return false;
    }

    return true;
}

export { getSelectedData, selectedItemsValidation };
