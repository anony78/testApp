/**
 * Generates dynamic HTML notification from given data
 *
 * @export {HTML Elements }
 * @param {object} bestCombination 
 * following format is required - example:
 * {
 *   "generation": 51,
 *   "gene": [1,1,1,0,1,0,0, 0,...],
 *   "fitness": 935
 * }
 * @param {object} items
 */
export function displayBestCombination(bestCombination, items) {
    const header = document.querySelector("header");
    const messageBlock = document.createElement("div");

    const bestItems =
        items
            .filter((item, index) => {
                if (bestCombination.gene[index] > 0) {
                    return item;
                }
            })
            .map((item) => {
                return item.name
            });

    messageBlock.classList.add("message-block");
    messageBlock.innerHTML = `
            <span class="message-title">AI calculation complete ! You should bring:</span>
            <p class="items">
                ${bestItems.join(" ,")}
            </p>
            <span class="items-count">
                Items count: <strong>${bestItems.length}</strong><br/>
                Items value: <strong>${bestCombination.fitness}</strong>
            </span>
            
    `;

    header.after(messageBlock);
}
