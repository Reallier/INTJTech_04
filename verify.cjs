const bcrypt = require("bcryptjs");
const hash = "$2b$10$OorwiP4UFv/va/xmO8YVb.x7QqNFzBhLqRR9hlP1xxBHzEwmMHSY.";
const pwd = "IntjSys2026AdminSecure88";
console.log("Testing:", pwd);
console.log("Match:", bcrypt.compareSync(pwd, hash));
