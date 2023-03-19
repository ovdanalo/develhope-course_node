const surprisingFact = "The bumblebee bat is the world's smallest mammal";

console.log('Surprising Fact:', surprisingFact);
console.log('Surprising Fact: %s', surprisingFact);

const familyTree = [
    {
        name: "Person 1",
        children: [
            {
                name: "Person 2",
                children: [
                    {
                        name: "Person 3",
                        children: [
                            {
                                name: "Person 4",
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

console.log(JSON.stringify(familyTree, null, 1));
console.dir(familyTree, { depth: null, colors: true });



let count = 0;

function importantTask() {
    console.count('This is the importantTask call n°');
    count += 1;
    if (count === 4) {
        console.warn('importantTask called 4 times, count resetted')
        console.countReset('This is the importantTask call n°');
    }
}
importantTask();
importantTask();
importantTask();
importantTask();
importantTask();
importantTask();
