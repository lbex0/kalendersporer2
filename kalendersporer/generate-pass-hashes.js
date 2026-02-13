const bcrypt = require("bcrypt");

const users = [
    { username: "nora.kristiansen", password: "abc1" },
    { username: "silje.andersen", password: "abc2" }
];

const generateHashes = async () => {
    for (const user of users) {
        const hash = await bcrypt.hash(user.password, 10); 
        console.log(`Username: ${user.username}, Hash: ${hash}`);
    }
};

generateHashes();