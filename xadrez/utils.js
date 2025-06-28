// Remove eventos de clique e destaque das casas
export function removerEventos(listeners) {
    for (let { casa, listener } of listeners) {
        casa.removeEventListener('click', listener);
        casa.classList.remove('red');
    }
    return [];
}

// Adiciona eventos de clique nas casas possíveis e destaca visualmente
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

// Cria o tabuleiro 8x8 e adiciona ao elemento pai (div .grid)
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

// Adiciona uma peça específica em determinadas posições do tabuleiro
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

// Retorna a posição [linha, coluna] do rei da cor especificada
export function posiçaoRei(array, cor) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let casa = array[i][j];
            if (casa.children.length === 1) {
                let peça = casa.firstElementChild;
                if (peça.className.includes('rei') && peça.className.includes(cor)) {
                    return [i, j];
                }
            }
        }
    }
    return null;
}

// Formata um número em mm:ss
export function toMMSS(numero) {
    let minutos = Math.floor(numero / 60);
    let segundos = Math.floor(numero - minutos * 60);
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}
