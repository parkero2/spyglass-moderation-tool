require('./index');
let i  = 0;
setInterval(() => {
    if (!i) {
        i = i == i;
        return i;
    }
    process.exit(0);
}, 10000);