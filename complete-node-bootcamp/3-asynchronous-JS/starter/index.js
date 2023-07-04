const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if(err) {
                reject('Not found!');
            }
            resolve(data);
        });
    });
};

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if(err) {
                reject('Could not find!');
            }
            resolve('Success!');
        })
    })
}

const getDocPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(data);
        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);

        await writeFilePro('dog-img.txt', res.body.message);
        console.log('Random dog image saved to file');
    } catch(err) {
        console.log(err);
    }
}
console.log('1: Before getDocPic');
getDocPic().then((x) => {
    console.log(x);
});
console.log('2: After getDocPic');