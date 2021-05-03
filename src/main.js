import { GA } from "./component/geneticAlgo.js";
import { getSelectedData, selectedItemsValidation } from "./component/form.js";
import { chart } from "./component/chart.js";

function handleSubmit(event) {
    event.preventDefault();

    /**
     * Get selected items
     */
    let selectedItems = getSelectedData(event.target);

    /**
     * Check current validation rules
     */
    if (!selectedItemsValidation(selectedItems)) {
        return false;
    }

    /**
     * Init GA
     */
    const ga = new GA(selectedItems)
    ga.init();
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", handleSubmit);
});
