// movimentos.js

const direcaoBispo = [[-1, -1], [-1, 1], [1, 1], [1, -1]];
const direcaoCavalo = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const direcaoRei = [[-1, 0], [-1, -1], [-1, 1], [0, -1], [0, 1], [1, 0], [1, -1], [1, 1]];

function dentroDoTabuleiro(linha, coluna) {
    return linha >= 0 && linha < 8 && coluna >= 0 && coluna < 8;
}

// Movimento peão branco, só move pra frente se casa livre, e diagonal pra capturar
export function movimentoPeaoWhite(arrayElementos, linha, coluna, casas = []) {
    // Movimento para frente
    if (dentroDoTabuleiro(linha - 1, coluna) && arrayElementos[linha - 1][coluna].children.length === 0) {
        casas.push(arrayElementos[linha - 1][coluna]);
        // Primeiro movimento pode avançar 2 casas
        if (linha === 6 && arrayElementos[linha - 2][coluna].children.length === 0) {
            casas.push(arrayElementos[linha - 2][coluna]);
        }
    }
    return casas;
}

// Movimento peão preto
export function movimentoPeaoBlack(arrayElementos, linha, coluna, casas = []) {
    // Movimento para frente
    if (dentroDoTabuleiro(linha + 1, coluna) && arrayElementos[linha + 1][coluna].children.length === 0) {
        casas.push(arrayElementos[linha + 1][coluna]);
        // Primeiro movimento pode avançar 2 casas
        if (linha === 1 && arrayElementos[linha + 2][coluna].children.length === 0) {
            casas.push(arrayElementos[linha + 2][coluna]);
        }
    }
    return casas;
}

// Capturar peão (diagonais com peça adversária)
export function capturarPeao(corAtual, linha, coluna, casas, arrayElementos) {
    let direcao = corAtual === 'white' ? -1 : 1;
    let corOposta = corAtual === 'white' ? 'black' : 'white';

    for (let dc of [-1, 1]) {
        let novaLinha = linha + direcao;
        let novaColuna = coluna + dc;

        if (dentroDoTabuleiro(novaLinha, novaColuna)) {
            let casa = arrayElementos[novaLinha][novaColuna];
            if (casa.children.length > 0) {
                let peca = casa.firstElementChild;
                if (peca.className.includes(corOposta)) {
                    casas.push(casa);
                }
            }
        }
    }
}

// Movimento torre
export function movimentoTorre(arrayElementos, linha, coluna, casas = [], corAtual) {
    const direcoes = [[-1,0],[1,0],[0,-1],[0,1]];
    for (let [dl, dc] of direcoes) {
        let l = linha + dl;
        let c = coluna + dc;
        while (dentroDoTabuleiro(l,c)) {
            let casa = arrayElementos[l][c];
            if (casa.children.length === 0) {
                casas.push(casa);
            } else {
                let peca = casa.firstElementChild;
                if (!peca.className.includes(corAtual)) {
                    casas.push(casa);
                }
                break;
            }
            l += dl;
            c += dc;
        }
    }
    return casas;
}

// Movimento bispo
export function movimentoBispo(arrayElementos, linha, coluna, casas = [], direcoes, corAtual) {
    for (let [dl, dc] of direcoes) {
        let l = linha + dl;
        let c = coluna + dc;
        while (dentroDoTabuleiro(l, c)) {
            let casa = arrayElementos[l][c];
            if (casa.children.length === 0) {
                casas.push(casa);
            } else {
                let peca = casa.firstElementChild;
                if (!peca.className.includes(corAtual)) {
                    casas.push(casa);
                }
                break;
            }
            l += dl;
            c += dc;
        }
    }
    return casas;
}

// Movimento cavalo
export function movimentoCavalo(arrayElementos, linha, coluna, casas = [], direcoes, corAtual) {
    for (let [dl, dc] of direcoes) {
        let l = linha + dl;
        let c = coluna + dc;
        if (dentroDoTabuleiro(l,c)) {
            let casa = arrayElementos[l][c];
            if (casa.children.length === 0) {
                casas.push(casa);
            } else {
                let peca = casa.firstElementChild;
                // Cavalo não pode capturar peça da mesma cor
                if (!peca.className.includes(corAtual)) {
                    casas.push(casa);
                }
            }
        }
    }
    return casas;
}

// Movimento rei
export function movimentoRei(arrayElementos, linha, coluna, casas = [], direcoes, corAtual) {
    for (let [dl, dc] of direcoes) {
        let l = linha + dl;
        let c = coluna + dc;
        if (dentroDoTabuleiro(l,c)) {
            let casa = arrayElementos[l][c];
            if (casa.children.length === 0) {
                casas.push(casa);
            } else {
                let peca = casa.firstElementChild;
                if (!peca.className.includes(corAtual)) {
                    casas.push(casa);
                }
            }
        }
    }
    return casas;
}

// Retorna todas as casas que ameaçam o rei adversário (usada para xeque)
// Aqui considera movimentos possíveis de todas as peças da cor adversária
export function casasAmeaçadas(arrayElementos, corAdversaria) {
    let ameaçadas = [];

    for (let i=0; i<8; i++) {
        for (let j=0; j<8; j++) {
            let casa = arrayElementos[i][j];
            if (casa.children.length === 0) continue;

            let peca = casa.firstElementChild;
            if (!peca.className.includes(corAdversaria)) continue;

            if (peca.className.includes('peao')) {
                // Casas que o peão ameaça são as diagonais para capturar
                let direcao = corAdversaria === 'white' ? -1 : 1;
                for (let dc of [-1, 1]) {
                    let l = i + direcao;
                    let c = j + dc;
                    if (dentroDoTabuleiro(l,c)) {
                        ameaçadas.push(arrayElementos[l][c]);
                    }
                }
            } else if (peca.className.includes('torre')) {
                movimentoTorre(arrayElementos, i, j, ameaçadas, corAdversaria);
            } else if (peca.className.includes('bispo')) {
                movimentoBispo(arrayElementos, i, j, ameaçadas, direcaoBispo, corAdversaria);
            } else if (peca.className.includes('cavalo')) {
                movimentoCavalo(arrayElementos, i, j, ameaçadas, direcaoCavalo, corAdversaria);
            } else if (peca.className.includes('rainha')) {
                movimentoTorre(arrayElementos, i, j, ameaçadas, corAdversaria);
                movimentoBispo(arrayElementos, i, j, ameaçadas, direcaoBispo, corAdversaria);
            } else if (peca.className.includes('rei')) {
                movimentoRei(arrayElementos, i, j, ameaçadas, direcaoRei, corAdversaria);
            }
        }
    }

    // remover duplicados, pois uma casa pode ser ameaçada por várias peças
    return [...new Set(ameaçadas)];
}
