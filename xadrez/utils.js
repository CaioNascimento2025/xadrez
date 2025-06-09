export function removerEventos(listeners) {
    for (let { casa, listener } of listeners) {
        casa.removeEventListener('click', listener);
        casa.classList.remove('red');
    }
    return [];
}

export function lancesPossiveis(casas, peça, casasDestacadas, listeners, moverFunc) {
    for (let casa of casas) {
        let listener = function (event) {
            moverFunc(event, peça, casasDestacadas);
        };
        casa.addEventListener('click', listener);
        casa.classList.add('red');
        listeners.push({ casa, listener });
    }
    return listeners;
}

export function criarTabuleiro(elementoPAI) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let casa = document.createElement('div');
            casa.className = (i + j) % 2 === 0 ? 'green casa' : 'white casa';
            casa.dataset.id = `${i},${j}`;
            elementoPAI.appendChild(casa);
        }
    }
}

export function adicionarPeça(elementoPAI, peça, linha, coluna) {
    let filhos = elementoPAI.querySelectorAll('.casa');
    let elementos = [];
    let array = [];

    for (let i = 0; i < 64; i++) {
        array.push(filhos[i]);
        if ((i + 1) % 8 === 0 && i !== 0) {
            elementos.push([...array]);
            array = [];
        }
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (linha.includes(i) && coluna.includes(j)) {
                let imagem = document.createElement('img');
                imagem.src = `imagens/${peça}.png`;
                imagem.className = `${peça}`;
                elementos[i][j].appendChild(imagem);
            }
        }
    }
    return elementos;
}

export function capturarPeao(corVez, linha, coluna, casasDestacadas, array) {
    let direções = corVez === 'white' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
    for (let [dx, dy] of direções) {
        let novaLinha = linha + dx;
        let novaColuna = coluna + dy;
        if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
            let casa = array[novaLinha][novaColuna];
            if (casa.children.length > 0) {
                let peça = casa.firstElementChild;
                let corPeça = peça.className.includes('white') ? 'white' : 'black';
                if (corPeça !== corVez) {
                    casasDestacadas.push(casa);
                }
            }
        }
    }
}

export function posiçaoRei(array,cor){
    let corRei = cor
    for(let i =0;i<8;i++){
        for(let j = 0;j<8;j++){
            let casa = array[i][j]
            if(casa.children.length ===1){
                let peça = casa.firstElementChild
                if(peça.className.includes('rei')){
                    return [i,j]
                }
            }
        }
    }
}

export function toMMSS(numero){
    let minutos = Math.floor(numero/60)
    let segundos = Math.floor(numero-minutos * 60)
    return `${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`
}