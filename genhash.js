const bcrypt = require("bcryptjs");
const hash = bcrypt.hashSync("IntjSys2026AdminSecure88", 10);
console.log(hash);
