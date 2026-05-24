const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class LoggerEmitter extends EventEmitter {}
const eventBus = new LoggerEmitter();

const logFilePath = path.join(__dirname, '../stats.json');

eventBus.on('requestCompleted', (stats) => {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        let logs = [];
        if (!err && data) {
            try { logs = JSON.parse(data); } catch (e) {}
        }
        logs.push(stats);
        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), () => {});
    });
});

module.exports = eventBus;