'use strict';

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

var window;
app.on('ready', function () {
    window = new BrowserWindow({width: 800, height: 600});

    window.loadURL('file://' + __dirname + '/../renderer/index.html');
    window.on('closed', function () {
        window = null;
    });
    const ret = globalShortcut.register('CommandOrControl+X', function () {
        console.log("asd");
        //window.webContents.send('takepicture');
    });

});

