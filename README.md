# Carderno de controle diário de entradas e saidas

Fiz esse app para minha esposa anotar entradas e saídas financeiras, onde ela trabalha não existe um sistema de controle financeiro, ela simplesmente anota tudo no "caderninho", então construi esse app para facilitar o controle que ela precisa ter, é bem simples, porém para o uso dela esta perfeito (palavras dela :))

## Índice
- <a href="#requisitos">Requisitos</a>
- <a href="#tecnologias-utilizadas">Tecnologias utilizadas</a>
- <a href="#funcionalidades-do-projeto">Funcionalidades do projeto</a>
- <a href="#como-rodar-este-projeto">Como rodar este projeto?</a>
- <a href="#imagens">Imagens</a>

## Funcionalidades do projeto
- [x] Inserção, edição e exclusão de registros
- [x] Filtro por períodos (datas)
- [x] Geração de relatórios (PDF)

## Tecnologias utilizadas
1. [Node.js](https://nodejs.org/pt)
2. [React](https://react.dev/)
4. [Electron](https://www.electronjs.org/pt/)
3. [Sqlite](https://www.sqlite.org/)

## Requisitos
Última versão do [Node.js](https://nodejs.org/pt) instalado na máquina, após as configurações e instalação do app não é nescessário manter o Node.js instalado

## Como rodar este projeto?
```bash
#Clone este repositório
$ git clone https://github.com/edilsontorres/simple-input-output-control

# Configure o caminho onde node.js esta instalado na máquina no arquivo package.json do frontend.
"extraResources": [
    {
        "from": "C:\\Program Files\\nodejs\\node.exe", # Aqui deve ser o caminho que o node está instalado no sistema.
        "to": "node/node.exe" # Linux geralmente é somente node, mas no Windows precisa do .exe
    }
]

# Configure a função startBackend no arquivo electron.cjs
function startBackend () {
   if (app.isPackaged) {
        backendRootPath = path.join(process.resourcesPath, 'backend');
        nodeExecutablePath = path.join(process.resourcesPath, 'node', 'node.exe');
   } else {
        backendRootPath = path.join(__dirname, '..', 'backend');
        nodeExecutablePath = 'node';
   }
}


# No terminal e navegue até o backend
$ cd simple-input-output-control/backend

# Instale as dependências
$ yarn # ou npm install

# Construa o backend
$ yarn build # ou npm build

# Navegue até o frontend
$ cd ..
$ cd simple-input-output-control/frontend

# Instale as dependencias
$ yarn # ou npm install

# Construa o frontend
$ yarn build # ou npm build

# Construa o app Electron
$ yarn dist # ou npm dist
```

## Imagens do app
![Tela do app](/projectImages/img1.png)
![Relatório](/projectImages/img2.png)
![Relatório por período](/projectImages/img3.png)
<!--  -->