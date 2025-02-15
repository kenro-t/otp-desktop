import { app, BrowserWindow } from 'electron';

app.on('ready', () => {
  const browserWindow = new BrowserWindow({
    width: 1000,
    height: 800
  });
  browserWindow.loadFile('./dist/index.html');
});