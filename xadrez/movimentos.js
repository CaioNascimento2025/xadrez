export function ehAdversario(casa, corAtual) {
    if (casa.children.length === 0) return false;
    const peça = casa.firstElementChild;
    const corPeça = peça.className.includes('white') ? 'white' : 'black';
    return corPeça !== corAtual;
}

export function movimentoPeaoWhite(array, linha, coluna, casasDestacadas) {
    if (linha - 1 >= 0) {
        let casa1 = array[linha - 1][coluna];
        if (casa1.children.length === 0) {
            casasDestacadas.push(casa1);
            if (linha === 6) {
                let casa2 = array[linha - 2][coluna];
                if (casa2.children.length === 0) {
                    casasDestacadas.push(casa2);
                }
            }
        }
    }
    return casasDestacadas;
}

export function movimentoPeaoBlack(array, linha, coluna, casasDestacadas) {
    if (linha + 1 < 8) {
        let casa1 = array[linha + 1][coluna];
        if (casa1.children.length === 0) {
            casasDestacadas.push(casa1);
            if (linha === 1) {
                let casa2 = array[linha + 2][coluna];
                if (casa2.children.length === 0) {
                    casasDestacadas.push(casa2);
                }
            }
        }
    }
    return casasDestacadas;
}

export function movimentoTorre(array, linha, coluna, casasDestacadas, corAtual) {
    // cima
    for (let i = linha - 1; i >= 0; i--) {
        let casa = array[i][coluna];
        if (casa.children.length === 0) {
            casasDestacadas.push(casa);
        } else if (ehAdversario(casa, corAtual)) {
            casasDestacadas.push(casa);
            break;
        } else break;
    }
    // baixo
    for (let i = linha + 1; i < 8; i++) {
        let casa = array[i][coluna];
        if (casa.children.length === 0) {
            casasDestacadas.push(casa);
        } else if (ehAdversario(casa, corAtual)) {
            casasDestacadas.push(casa);
            break;
        } else break;
    }
    // esquerda
    for (let j = coluna - 1; j >= 0; j--) {
        let casa = array[linha][j];
        if (casa.children.length === 0) {
            casasDestacadas.push(casa);
        } else if (ehAdversario(casa, corAtual)) {
            casasDestacadas.push(casa);
            break;
        } else break;
    }
    // direita
    for (let j = coluna + 1; j < 8; j++) {
        let casa = array[linha][j];
        if (casa.children.length === 0) {
            casasDestacadas.push(casa);
        } else if (ehAdversario(casa, corAtual)) {
            casasDestacadas.push(casa);
            break;
        } else break;
    }
    return casasDestacadas;
}

export function movimentoBispo(array, linha, coluna, casasDestacadas, direcao, corAtual) {
    for (let [dx, dy] of direcao) {
        let h = linha + dx;
        let i = coluna + dy;
        while (h >= 0 && h < 8 && i >= 0 && i < 8) {
            let casa = array[h][i];
            if (casa.children.length === 0) {
                casasDestacadas.push(casa);
            } else if (ehAdversario(casa, corAtual)) {
                casasDestacadas.push(casa);
                break;
            } else break;
            h += dx;
            i += dy;
        }
    }
    return casasDestacadas;
}

export function movimentoCavalo(array, linha, coluna, casasDestacadas, direcao, corAtual) {
    for (let [dx, dy] of direcao) {
        let novaLinha = linha + dx;
        let novaColuna = coluna + dy;
        if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
            let casa = array[novaLinha][novaColuna];
            if (casa.children.length === 0 || ehAdversario(casa, corAtual)) {
                casasDestacadas.push(casa);
            }
        }
    }
    return casasDestacadas;
}

export function movimentoRei(array, linha, coluna, casasDestacadas, direcao, corAtual) {
    for (let [dx, dy] of direcao) {
        let novaLinha = linha + dx;
        let novaColuna = coluna + dy;
        if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
            let casa = array[novaLinha][novaColuna];
            if (casa.children.length === 0 || ehAdversario(casa, corAtual)) {
                casasDestacadas.push(casa);
            }
        }
    }
    return casasDestacadas;
}

export function capturarPeao(corVez, linha, coluna, casasDestacadas, array) {
    let casasVermelhas = [];
    let direções = corVez === 'white' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];

    for (let [dx, dy] of direções) {
        let novaLinha = linha + dx;
        let novaColuna = coluna + dy;
        if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
            let casa = array[novaLinha][novaColuna];
            // Sempre adiciona a casa (ameaça) se tiver peça ou não
            casasVermelhas.push(casa);
            if (casa.children.length > 0) {
                let peça = casa.firstElementChild;
                let corPeça = peça.className.includes('white') ? 'white' : 'black';
                if (corPeça !== corVez) {
                    casasDestacadas.push(casa);
                }
            }
        }
    }
    return casasVermelhas;
}

export function casasAmeaçadas(array, cor) {
    let corAdversaria = cor === 'white' ? 'black' : 'white';
    let casasVermelhas = [];
    let direcoesBispo = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    let direcoesTorre = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let direcoesCavalo = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    let direcoesRei = [...direcoesBispo, ...direcoesTorre];

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let casa = array[i][j];
            if (casa.children.length === 1) {
                let peça = casa.firstElementChild;
                if (peça.className.includes(corAdversaria)) {
                    if (peça.className.includes('peao')) {
                        casasVermelhas.push(...capturarPeao(corAdversaria, i, j, [], array));
                    } else if (peça.className.includes('torre')) {
                        movimentoTorre(array, i, j, casasVermelhas, corAdversaria);
                    } else if (peça.className.includes('bispo')) {
                        movimentoBispo(array, i, j, casasVermelhas, direcoesBispo, corAdversaria);
                    } else if (peça.className.includes('cavalo')) {
                        movimentoCavalo(array, i, j, casasVermelhas, direcoesCavalo, corAdversaria);
                    } else if (peça.className.includes('rainha')) {
                        movimentoTorre(array, i, j, casasVermelhas, corAdversaria);
                        movimentoBispo(array, i, j, casasVermelhas, direcoesBispo, corAdversaria);
                    } else if (peça.className.includes('rei')) {
                        movimentoRei(array, i, j, casasVermelhas, direcoesRei, corAdversaria);
                    }
                }
            }
        }
    }

    return casasVermelhas;
}




