import { writeFile } from 'node:fs';

const data = 'Hello, Alessandro!';

writeFile('message.txt', data, (err) => {
    if (err) throw err;
    console.log('The file has been saved!')
})
