const { exec } = require('child_process');

module.exports.trigger = el => {
    exec(el.options, (err) => {
        if (err)
            console.error(err);
    });
};
