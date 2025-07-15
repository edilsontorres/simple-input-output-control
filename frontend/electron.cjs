const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const kill = require('tree-kill');

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));

}


function startBackend() {
  const backendDir = path.join(__dirname, '../backend');

  backendProcess = spawn('node', ['dist/index.js'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true,
  });

  backendProcess.on('error', (err) => {
    console.error('Erro ao iniciar o backend:', err);
  });
}

function killBackendAndQuit() {
  if (backendProcess && backendProcess.pid) {
    console.log(`Encerrando backend (PID: ${backendProcess.pid})...`);
    kill(backendProcess.pid, 'SIGKILL', (err) => {
      if (err) {
        console.error("Erro ao finalizar backend:", err);
      } else {
        console.log("Backend encerrado com sucesso!");
      }
      app.exit(); 
    });
  } else {
    console.log("Nenhum processo backend encontrado para encerrar.");
    app.exit();
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  killBackendAndQuit();
});

app.on('before-quit', (e) => {
  e.preventDefault(); 
  killBackendAndQuit(); 
});