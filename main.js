import { app, BrowserWindow } from 'electron';

app.on('ready', () => {
  const browserWindow = new BrowserWindow({
    width: 800,
    height: 1200
  });
  // browserWindow.loadFile('./dist/index.html');
  browserWindow.loadFile('./mock/list.html');
});