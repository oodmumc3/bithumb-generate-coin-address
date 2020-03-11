const { app, BrowserWindow } = require('electron');

function createWindow () {
    // 브라우저 창을 생성합니다.
    let win = new BrowserWindow({
        width: 850,
        height: 750,
        webPreferences: {
            nodeIntegration: true
            // ,devTools: false
        }
    });

    // 그리고 앱의 index.html를 로드합니다.
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
