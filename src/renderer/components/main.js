'use strict';

const React = require('react');
const desktopCapturer = require('electron').desktopCapturer;
const h = React.createElement;
const ipcRenderer = require('electron').ipcRenderer;

const ocrSDK = require("nicomsoft-ocr-electron");
class Main extends React.Component {
    constructor(props) {
        super(props);

        desktopCapturer.getSources({types: ['screen']}, (error, sources) => {
            if (error) throw error;
            navigator.webkitGetUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: sources[0].id,
                            maxWidth: screen.width / 2, maxHeight: screen.height / 2,
                            minWidth: screen.width / 3, minHeight: screen.height / 3
                        }
                    }
                }, (stream) => {
                    this.video = document.createElement('video');
                    this.video.src = URL.createObjectURL(stream);
                },
                (error) => {
                    console.log('getUserMediaError');
                }
            )
            ;
        })
        ;
        ipcRenderer.on('takepicture', (event, arg) => {
            this.takepicture();
            // require('electron').remote.app.focus();
            //require('electron').remote.getCurrentWindow().show()
        })
        ;
    }

    takepicture() {

        require('electron').remote.getCurrentWindow().hide();
        setTimeout(() => {
                let canvas = document.querySelector('canvas');
                let log = document.querySelector('.logs');
                canvas.width = screen.width / 2;
                canvas.height = screen.height / 2;

                canvas.getContext('2d').drawImage(this.video, 0, 0);
                log.value += "Image with resolution " + screen.width + " X " + screen.height + " has been captured \n \n";
                require('electron').remote.getCurrentWindow().show();
            }
        );

    }

    extractdata() {
        let canvas = document.querySelector('canvas');
        canvas.toBlob((blob) => {
            if (ocrSDK.init(blob, {Catalan: true}, {}, "D:\\desktopCapture", "")) {
                var json = ocrSDK.performOcr(this.callback);
            } else {
                var errors = ocrSDK.GetError();
                for (var i = 0; i < errors.length; i++) {
                    var obj = errors[i];
                    this.callback(obj);
                }
            }
        });
    }

    callback(output) {
        let log = document.querySelector('.logs');
        log.value += output;
    }

    render() {
        return h('div', {className: 'main'},
            h('canvas', {id: 'canvas'}),
            h('div', {className: 'row'},
                h('button', {
                        className: 'capture',
                        onClick: () => {
                            this.takepicture()
                        },
                        style: {
                            width: 150, height: 30
                        }
                    },
                    'Take Photo'),
                h('button', {
                        className: 'extract',
                        onClick: () => {
                            this.extractdata()
                        },
                        style: {
                            width: 150, height: 30
                        }
                    },
                    'Extract Data')
            ),
            h('textarea', {
                className: 'logs',
                style: {
                    "width": "100%", "height": "500px"
                }
            })
        );
    }
}

module.exports = Main;
