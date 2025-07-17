const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const kill = require('tree-kill');

let backendProcess;
let nodeExecutablePath;
let backendDir;
let backendScriptToRun;
let backendRootPath;
let backendScriptPath;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, 'notebook.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));

}

function startBackend() {


  if (app.isPackaged) {
    backendRootPath = path.join(process.resourcesPath, 'backend');
    nodeExecutablePath = path.join(process.resourcesPath, 'node', 'node');
  } else {
    backendRootPath = path.join(__dirname, '..', 'backend');
    nodeExecutablePath = 'node';
  }
  
  backendScriptPath = path.join(backendRootPath, 'dist', 'index.js');
  backendScriptToRun = path.join(backendRootPath, 'dist', 'index.js');

  console.log(`[Backend Debug] Usando Node.js de: ${nodeExecutablePath}`);
  console.log(`[Backend Debug] Diretório Raiz do Backend: ${backendRootPath}`);
  console.log(`[Backend Debug] Script do Backend a ser executado: ${backendScriptPath}`);

  const userDataPath = app.getPath('userData');
  const databaseFilePath = path.join(userDataPath, 'database.sqlite');

  console.log(`[Backend Debug] Caminho do Banco de Dados SQLite: ${databaseFilePath}`)

  backendProcess = spawn(nodeExecutablePath, [backendScriptToRun], {
    cwd: backendRootPath,    // MUITO IMPORTANTE: Define o diretório de trabalho do backend
    stdio: 'pipe',      // ESSENCIAL: Redireciona stdout/stderr para o processo principal do Electron
    shell: false,       // EVITA: Problemas com /bin/sh
    env: {
      ...process.env,
      DATABASE_PATH: databaseFilePath
    }
  });

  

  // const backendPath = app.isPackaged
  //   ? path.join(process.resourcesPath, 'backend')
  //   : path.join(__dirname, '../backend');

  //const backendDir = path.join(__dirname, '../backend');

  // backendProcess = spawn('node', ['dist/index.js'], {
  //   cwd: backendPath,
  //   stdio: 'pipe',
  //   shell: true,
  // });


  backendProcess.on('error', (err) => {
    console.error('Erro ao iniciar o backend:', err);
    console.error('[Backend ERROR] Caminho do Node:', nodeExecutablePath);
    console.error('[Backend ERROR] Caminho do Backend:', backendDir);
    console.error('[Backend ERROR] Argumentos do Spawn:', [path.join(backendDir, 'dist', 'index.js')]);

  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`[Backend STDOUT]: ${data.toString().trim()}`);
  });
  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend STDERR]: ${data.toString().trim()}`);
  });
  backendProcess.on('exit', (code, signal) => {
    console.log(`[Backend INFO] Processo do backend encerrado com código ${code} e sinal ${signal}`);
  })


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