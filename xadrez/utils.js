
// Destaca lances possíveis e adiciona listeners
export function lancesPossiveis(casas){
    for (let casa of casas) {
        if (casa.children.length === 0 || ehAdversario(casa)) {
            let listener = criarListenerMover(peçaSelecionada, casasDestacadas);
            casa.addEventListener('click', listener);
            casa.classList.add('red');
            listenersAtuais.push({ casa, listener });
        }
    }
};


// Cria função listener individual por casa
export function criarListenerMover(peça, casas){
    return function (event) {
        mexerPeça(event, peça, casas);
    };
};


// Função para mover a peça
export function mexerPeça(event, peça, casas){
    if(event.target.tagName == 'IMG'){
        event.target.remove()
    }
    peça.parentNode.removeChild(peça);
    event.currentTarget.appendChild(peça);
    removerEventos();
    começouJogo = true
    let id = setInterval(()=>{
        if(!começouJogo) return
        if(isWhite){
            contadorWhite += 1
            jogadorWhite.innerText = toMMSS((300-contadorWhite))
        }else{
            contadorBlack += 1
            jogadorBlack.innerText = toMMSS((300-contadorBlack))
        }
        if(jogadorBlack.innerText === '00:00'){
            alert('jogador white venceu')
            clearInterval(id)
             return
    }else if(jogadorWhite.innerText === '00:00'){
        alert('jogador black venceu')
        clearInterval(id)
        return
    }
    },1000)
    isWhite = !isWhite

};


// Remove listeners antigos e destaca a nova peça
export function removerEventos(){
    for (let { casa, listener } of listenersAtuais) {
        casa.removeEventListener('click', listener);
        casa.classList.remove('red');
    }
    listenersAtuais = [];
};

// Adiciona peça no tabuleiro
export function adicionarPeça(elementoPAI, peça, linha, coluna){
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
};



// Cria o tabuleiro
export function criarTabuleiro(elementoPAI){
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let casa = document.createElement('div');
            casa.className = (i + j) % 2 === 0 ? 'green casa' : 'white casa';
            casa.dataset.id = `${i},${j}`;
            elementoPAI.appendChild(casa);
        }
    }
};


//capturar peão nas diagonais
export function capturarPeao(corVez,linha,coluna,casasDestacadas,array){
    let direçaoPiaoWhite = [[-1,-1],[-1,1]]
    let direçaoPiaoBlack = [[1,-1],[1,1]]
    if(corVez == 'white'){
        for(let [dx,dy] of direçaoPiaoWhite){
            let novaLinha = linha + dx
            let novaColuna = coluna + dy
            if(novaColuna >= 0 && novaColuna <8){
                let casa = array[novaLinha][novaColuna]
                let peça = casa.firstElementChild
                if(casa.children.length === 1 && peça.className.includes('black') ){
                    casasDestacadas.push(casa)
            }
            }
            
        }
        
    }else if(corVez == 'black'){
        for(let [dx,dy] of direçaoPiaoBlack){
            let novaLinha = linha + dx
            let novaColuna = coluna + dy
            if(novaColuna >= 0 && novaColuna <8){
                let casa = array[novaLinha][novaColuna]
                let peça = casa.firstElementChild
                if(casa.children.length === 1 && peça.className.includes('white') ){
                    casasDestacadas.push(casa)
            }
            }
            
        }
    }

}

//transformar segundos em minutos
export function toMMSS(numero){
    let minutos = Math.floor(numero/60)
    let segundos = Math.floor(numero - minutos * 60)
    return `${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`
}

//verifica se é adversario
export function ehAdversario(casa){
    if (casa.children.length === 0) return false;
    const peça = casa.firstElementChild;
    const corPeça = peça.className.includes('white') ? 'white' : 'black';
    return corPeça !== corAtual;
};



//pega a posição do rei
export function posiçaoRei(array,cor){
    for(let i=0;i<8;i++){
        for(let j =0;j<8;j++){
            let casa = array[i][j]
            if(casa.children.length === 1){
                if(casa.firstElementChild.className.includes(`rei-${cor}`)){
                    return [i,j]
            }
            }
            
        }
    }
}


export function casasAmeaçadas(array,cor,rei){
    let [linhaRei,colunaRei] = rei
    let casas = []
    let corAdversaria = cor === 'white' ? 'black':'white'
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            let casa = array[i][j]
            if(casa.children.length === 1){
                let peça = casa.firstElementChild
                if(peça.className.includes(corAdversaria)){

                }
            }
        }
    }

}