import * as Utils from './utils.js';
import * as Movimento from './movimentos.js';

const grid = document.querySelector('.grid');
const jogadorWhite = document.querySelector('.jogador-white');
const jogadorBlack = document.querySelector('.jogador-black');
let xequeMate = false;
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

    if (!elementoPAI || !elementoPAI.dataset.id || elemento.tagName !== 'IMG') return;
    if (xequeMate) return
    const corAtual = elemento.className.includes('white') ? 'white' : 'black';
    if ((isWhite && corAtual === 'black') || (!isWhite && corAtual === 'white')) return;

    const [linha, coluna] = elementoPAI.dataset.id.split(',').map(Number);

    listenersAtuais = Utils.removerEventos(listenersAtuais);
    casasDestacadas = [];
    peçaSelecionada = elemento;

    let ameaçadas = Movimento.casasAmeaçadas(arrayElementos, corAtual);
    let idsAmeaçadas = new Set(ameaçadas.map(casa => casa.dataset.id));

    // Detecta tipo da peça
    if (elemento.className.includes('peao')) {
        Movimento.capturarPeao(corAtual, linha, coluna, casasDestacadas, arrayElementos);
        casasDestacadas = corAtual === 'white'
            ? Movimento.movimentoPeaoWhite(arrayElementos, linha, coluna, casasDestacadas)
            : Movimento.movimentoPeaoBlack(arrayElementos, linha, coluna, casasDestacadas);
    } else if (elemento.className.includes('torre')) {
        casasDestacadas = Movimento.movimentoTorre(arrayElementos, linha, coluna, casasDestacadas, corAtual);
    } else if (elemento.className.includes('bispo')) {
        casasDestacadas = Movimento.movimentoBispo(arrayElementos, linha, coluna, casasDestacadas, direçaoBispo, corAtual);
    } else if (elemento.className.includes('cavalo')) {
        casasDestacadas = Movimento.movimentoCavalo(arrayElementos, linha, coluna, casasDestacadas, direçaoCavalo, corAtual);
    } else if (elemento.className.includes('rainha')) {
        let array1 = Movimento.movimentoTorre(arrayElementos, linha, coluna, [], corAtual);
        let array2 = Movimento.movimentoBispo(arrayElementos, linha, coluna, [], direçaoBispo, corAtual);
        casasDestacadas = [...array1, ...array2];
    } else if (elemento.className.includes('rei')) {
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
    let corAtual = isWhite ? 'white' : 'black';

    if (verificarXequeMate(elementos, corAtual)) {
        alert(`Xeque-mate! Jogador ${isWhite ? 'Black' : 'White'} venceu!`);
        xequeMate = true;
        grid.removeEventListener('click', moverPeça);
        clearInterval(intervalId);
    } 
}

function verificarXequeMate(arrayElementos, corAtual) {
    const corAdversaria = corAtual === 'white' ? 'black' : 'white';
    const posRei = Utils.posiçaoRei(arrayElementos, corAtual);

    if (!posRei) return false;

    const [reiLinha, reiColuna] = posRei;
    const casasAmeaçadas = Movimento.casasAmeaçadas(arrayElementos, corAdversaria);
    const idsAmeaçadas = new Set(casasAmeaçadas.map(casa => casa.dataset.id));

    const reiCasa = arrayElementos[reiLinha][reiColuna];
    if (!idsAmeaçadas.has(reiCasa.dataset.id)) {
        return false;
    }


    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const casa = arrayElementos[i][j];
            if (casa.children.length === 0) continue;

            const peça = casa.firstElementChild;
            if (!peça.className.includes(corAtual)) continue;

            let movimentos = [];
            if (peça.className.includes('peao')) {
                Movimento.capturarPeao(corAtual, i, j, movimentos, arrayElementos);
                movimentos = corAtual === 'white'
                    ? Movimento.movimentoPeaoWhite(arrayElementos, i, j, movimentos)
                    : Movimento.movimentoPeaoBlack(arrayElementos, i, j, movimentos);
            } else if (peça.className.includes('torre')) {
                movimentos = Movimento.movimentoTorre(arrayElementos, i, j, [], corAtual);
            } else if (peça.className.includes('bispo')) {
                movimentos = Movimento.movimentoBispo(arrayElementos, i, j, [], direçaoBispo, corAtual);
            } else if (peça.className.includes('cavalo')) {
                movimentos = Movimento.movimentoCavalo(arrayElementos, i, j, [], direçaoCavalo, corAtual);
            } else if (peça.className.includes('rainha')) {
                const torre = Movimento.movimentoTorre(arrayElementos, i, j, [], corAtual);
                const bispo = Movimento.movimentoBispo(arrayElementos, i, j, [], direçaoBispo, corAtual);
                movimentos = [...torre, ...bispo];
            } else if (peça.className.includes('rei')) {
                let movimentosRei = Movimento.movimentoRei(arrayElementos, i, j, [], direçaoRei, corAtual);
                movimentos = movimentosRei.filter(casa => !idsAmeaçadas.has(casa.dataset.id));
            }

            for (let destino of movimentos) {
                const backupOrigem = casa.innerHTML;
                const backupDestino = destino.innerHTML;

                destino.innerHTML = '';
                destino.appendChild(peça);
                casa.innerHTML = '';

                const novaPosRei = Utils.posiçaoRei(arrayElementos, corAtual);
                const novasAmeacas = Movimento.casasAmeaçadas(arrayElementos, corAdversaria);
                const novasIds = new Set(novasAmeacas.map(c => c.dataset.id));
                const reiAposMov = arrayElementos[novaPosRei[0]][novaPosRei[1]];
                const aindaEmXeque = novasIds.has(reiAposMov.dataset.id);

                casa.innerHTML = backupOrigem;
                destino.innerHTML = backupDestino;

                if (!aindaEmXeque) {
                    return false;
                }
            }
        }
    }

    console.log('✔️ XEQUE-MATE confirmado para', corAtual);
    return true;
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

// Inicialização
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
