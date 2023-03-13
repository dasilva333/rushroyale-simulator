let cards = Object.keys(temp2.cards);
cards.splice(cards.indexOf('dryad_growth'), 1)
let combinations = [];
let index = 0;
for (card of cards) {
    let set = cards.slice(0); //copy original
    let combosFound = false;
    while (!combosFound) {
        let group = set.slice(index, index + 4); //grab first 4 (5th being inquis)
        console.log("group", group.length);
        let seed = group.slice(0);
        //add that group to the combinations if it's length 4 bc after this recursive loop it'll start mixing and matching the remainders
        if (seed.length == 4) {
            //  combinations.push(['seed', seed]);
            combinations.push(seed);
        }
        //remove the 4th card
        let lastElement = group.pop();
        let remainingCards = set.slice(4, set.length); //save the remaining ones
        console.log('remaining cards', remainingCards.length);
        for (remainder of remainingCards) {
            console.log('set of 3 length', group.length);
            let tmp = group.slice(0); //copy what is now a set of 3
            tmp.push(remainder); //add one of the remainders to the group
            if (tmp.length == 4) {
                //combinations.push(['copy', tmp]); //add that to the combinations
                combinations.push(tmp);
            }

        }
        console.log('1', group);

        combosFound = true;
    }
    index++;
}

console.log('combinations', combinations);

let deckTemplate = {
    cards: [
    ],
    hero: 'gadget',
    amulet: 'magic',
    weapon: 'spear',
    inquisTierLevel: 7
};


let cardsTemplate = { name: '', level: 9, tier: 7 };
let witchTemplate = { name: 'witch_statue', level: 14, tier: 7, merges: 30 };
let decks = [];
for (combo of combinations) {
    //let tmp = Object.assign({}, deckTemplate);
    //tmp.cards = combo;
    let tmp = combo.map((cardName) => {
        if (cardName == 'witch_statue') {
            return witchTemplate;
        } else {
            console.log('cardName', cardName);
            let cardTemplate = Object.assign({}, cardsTemplate);
            cardTemplate.name = cardName;
            return cardTemplate;
        }

    });
    temp2.setCards(tmp);
    let result = temp2.totalDamagePerSecond();
    decks.push([tmp, result]);
}

sorted = decks.sort((a, b) => {
    return a[1] - b[1];
});

console.log('decks', sorted);

