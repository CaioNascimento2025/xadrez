import * as Utils from './utils.js';
import * as Movimento from './movimentos.js';

const grid = document.querySelector('.grid');
const jogadorWhite = document.querySelector('.jogador-white');
const jogadorBlack = document.querySelector('.jogador-black');

let isWhite = true;
let peçaSelecionada = null;
let casasDestacadas = [];
let listenersAtuais = [];
let contadorWhite = 0;
let contadorBlack = 0;
let iniciouTimer = false;
let intervalId;

const direçaoBispo = [[-1, -1], [-1, 1], [1, 1], [1, -1]];
const direçaoCavalo = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const direçaoRei = [[-1, 0], [-1, -1], [-1, 1], [0, -1], [0, 1], [1, 0], [1, -1], [1, 1]];

function moverPeça(event, arrayElementos) {
    let elemento = event.target;
    let elementoPAI = elemento.parentNode;

    if (!elementoPAI.dataset.id || elemento.tagName !== 'IMG') return;

    const corAtual = elemento.className.includes('white') ? 'white' : 'black';
    if ((isWhite && corAtual === 'black') || (!isWhite && corAtual === 'white')) return;

    const [linha, coluna] = elementoPAI.dataset.id.split(',').map(Number);

    listenersAtuais = Utils.removerEventos(listenersAtuais);
    casasDestacadas = [];
    peçaSelecionada = elemento;

    let ameaçadas = Movimento.casasAmeaçadas(arrayElementos, corAtual);
    let idsAmeaçadas = new Set(ameaçadas.map(casa => casa.dataset.id));
    let movimentosRei = Movimento.movimentoRei(arrayElementos,linha,coluna,[],direçaoRei,corAtual)
    // Detecta tipo da peça
    if (elemento.className.includes('peao')) {
        Movimento.capturarPeao(corAtual, linha, coluna, casasDestacadas, arrayElementos);
        casasDestacadas = corAtual === 'white'
            ? Movimento.movimentoPeaoWhite(arrayElementos, linha, coluna, casasDestacadas)
            : Movimento.movimentoPeaoBlack(arrayElementos, linha, coluna, casasDestacadas);
    }
    else if (elemento.className.includes('torre')) {
        casasDestacadas = Movimento.movimentoTorre(arrayElementos, linha, coluna, casasDestacadas, corAtual);
    }
    else if (elemento.className.includes('bispo')) {
        casasDestacadas = Movimento.movimentoBispo(arrayElementos, linha, coluna, casasDestacadas, direçaoBispo, corAtual);
    }
    else if (elemento.className.includes('cavalo')) {
        casasDestacadas = Movimento.movimentoCavalo(arrayElementos, linha, coluna, casasDestacadas, direçaoCavalo, corAtual);
    }
    else if (elemento.className.includes('rainha')) {
        let array1 = Movimento.movimentoTorre(arrayElementos, linha, coluna, [], corAtual);
        let array2 = Movimento.movimentoBispo(arrayElementos, linha, coluna, [], direçaoBispo, corAtual);
        casasDestacadas = [...array1, ...array2];
    }
    else if (elemento.className.includes('rei')) {
        let movimentosRei = Movimento.movimentoRei(arrayElementos, linha, coluna, [], direçaoRei, corAtual);
        casasDestacadas = movimentosRei.filter(casa => !idsAmeaçadas.has(casa.dataset.id));
    }

    listenersAtuais = Utils.lancesPossiveis(
        casasDestacadas,
        peçaSelecionada,
        casasDestacadas,
        listenersAtuais,
        executarMovimento
    );

    Utils.posiçaoRei(arrayElementos, corAtual); // Opcional: debug ou lógica futura
}

function executarMovimento(event, peça, casas) {
    if (event.target.tagName === 'IMG') {
        event.target.remove();
    }

    peça.parentNode.removeChild(peça);
    event.currentTarget.appendChild(peça);

    listenersAtuais = Utils.removerEventos(listenersAtuais);
    casasDestacadas = [];

    if (!iniciouTimer) {
        iniciarRelogio();
        iniciouTimer = true;
    }

    isWhite = !isWhite;
}

function iniciarRelogio() {
    intervalId = setInterval(() => {
        if (isWhite) {
            contadorWhite++;
            jogadorWhite.innerText = Utils.toMMSS(300 - contadorWhite);
        } else {
            contadorBlack++;
            jogadorBlack.innerText = Utils.toMMSS(300 - contadorBlack);
        }

        if (contadorWhite >= 300) {
            alert('Jogador Black venceu!');
            clearInterval(intervalId);
        } else if (contadorBlack >= 300) {
            alert('Jogador White venceu!');
            clearInterval(intervalId);
        }
    }, 1000);
}

// Inicialização do tabuleiro e peças
Utils.criarTabuleiro(grid);

let elementos = Utils.adicionarPeça(grid, 'peao-white', [6], [0, 1, 2, 3, 4, 5, 6, 7]);
Utils.adicionarPeça(grid, 'peao-black', [1], [0, 1, 2, 3, 4, 5, 6, 7]);
Utils.adicionarPeça(grid, 'torre-white', [7], [0, 7]);
Utils.adicionarPeça(grid, 'torre-black', [0], [0, 7]);
Utils.adicionarPeça(grid, 'bispo-white', [7], [2, 5]);
Utils.adicionarPeça(grid, 'bispo-black', [0], [2, 5]);
Utils.adicionarPeça(grid, 'cavalo-white', [7], [1, 6]);
Utils.adicionarPeça(grid, 'cavalo-black', [0], [1, 6]);
Utils.adicionarPeça(grid, 'rainha-white', [7], [4]);
Utils.adicionarPeça(grid, 'rainha-black', [0], [4]);
Utils.adicionarPeça(grid, 'rei-white', [7], [3]);
Utils.adicionarPeça(grid, 'rei-black', [0], [3]);

grid.addEventListener('click', (event) => moverPeça(event, elementos));
