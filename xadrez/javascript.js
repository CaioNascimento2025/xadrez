const grid = document.querySelector('.grid');
const jogadorWhite = document.querySelector('.jogador-white')
const jogadorBlack = document.querySelector('.jogador-black')


let casasDestacadas = [];
let peçaSelecionada = null;
let listenersAtuais = [];
let começouJogo = false
let isWhite = true
let corAtual = 'cavalo-white'
const direçaoBispo = [[-1,-1],[-1,1],[1,1],[1,-1]]
const capturaPeao = [[1,-1],[1,1]]
let contadorWhite = 0
let contadorBlack = 0


let toMMSS = (numero) =>{
    let minutos = Math.floor(numero/60)
    let segundos = Math.floor(numero - minutos * 60)
    return `${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`
}

const ehAdversario = (casa) => {
    if (casa.children.length === 0) return false;
    const peça = casa.firstElementChild;
    const corPeça = peça.className.includes('white') ? 'white' : 'black';
    return corPeça !== corAtual;
};

const capturarPeao = (corVez,linha,coluna,casasDestacadas,array)=>{
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
// Cria o tabuleiro
let criarTabuleiro = (elementoPAI) => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let casa = document.createElement('div');
            casa.className = (i + j) % 2 === 0 ? 'green casa' : 'white casa';
            casa.dataset.id = `${i},${j}`;
            elementoPAI.appendChild(casa);
        }
    }
};

// Adiciona peça no tabuleiro
let adicionarPeça = (elementoPAI, peça, linha, coluna) => {
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

// Remove listeners antigos e destaca a nova peça
let removerEventos = () => {
    for (let { casa, listener } of listenersAtuais) {
        casa.removeEventListener('click', listener);
        casa.classList.remove('red');
    }
    listenersAtuais = [];
};

// Função para mover a peça
let mexerPeça = (event, peça, casas) => {
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

// Cria função listener individual por casa
let criarListenerMover = (peça, casas) => {
    return function (event) {
        mexerPeça(event, peça, casas);
    };
};

// Destaca lances possíveis e adiciona listeners
let lancesPossiveis = (casas) => {
    for (let casa of casas) {
        if (casa.children.length === 0 || ehAdversario(casa)) {
            let listener = criarListenerMover(peçaSelecionada, casasDestacadas);
            casa.addEventListener('click', listener);
            casa.classList.add('red');
            listenersAtuais.push({ casa, listener });
        }
    }
};


// Define o comportamento ao clicar numa peça
let moverPeça = (event, arrayElementos) => {
    let elemento = event.target;
    let elementoPAI = elemento.parentNode;
    corAtual = elemento.className.includes('white')?'white':'black'
    if (!elementoPAI.dataset.id) return;
    if(isWhite && elemento.className.includes('black')) return
    else if(!isWhite && elemento.className.includes('white')) return
    let [linhaStr, colunaStr] = elementoPAI.dataset.id.split(',');
    let linha = parseInt(linhaStr);
    let coluna = parseInt(colunaStr);

    // Apenas para peões brancos por enquanto
    if (elemento.className.includes('peao-white')) {
        removerEventos();
        casasDestacadas = [];
        capturarPeao(corAtual,linha,coluna,casasDestacadas,arrayElementos)
        if (linha - 1 >= 0) {
            let casa1 = arrayElementos[linha - 1][coluna];
            if(casa1.children.length === 0){
                casasDestacadas.push(casa1);
            }
            
        }

        // Movimento de 2 casas se estiver na posição inicial
        if (linha === 6 && linha - 2 >= 0) {
            let casa2 = arrayElementos[linha - 2][coluna];
            if(arrayElementos[linha -1][coluna].children.length === 0){
                 if(casa2.children.length == 0){
                 casasDestacadas.push(casa2);
            }
            }
           
        }

        peçaSelecionada = elemento;
        lancesPossiveis(casasDestacadas);
    }

    else if (elemento.className.includes('peao-black')) {
        removerEventos();
        casasDestacadas = [];
        capturarPeao(corAtual,linha,coluna,casasDestacadas,arrayElementos)
        if (linha + 1 < 8) {
            let casa1 = arrayElementos[linha +1][coluna];
            if(casa1.children.length === 0){
                 casasDestacadas.push(casa1);
            }
           
        }

        // Movimento de 2 casas se estiver na posição inicial
        if (linha === 1 && linha + 2 < 8) {
            let casa2 = arrayElementos[linha +2][coluna];
            if(arrayElementos[linha+1][coluna].children.length === 0){
                 if(casa2.children.length === 0){
                     casasDestacadas.push(casa2);
            }
            }
           
        }

        peçaSelecionada = elemento;
        lancesPossiveis(casasDestacadas);
    }

    else if (elemento.className.includes('torre-white') || elemento.className.includes('torre-black')) {
        removerEventos();
        casasDestacadas = [];
        //para cima
        for(let i = linha -1;i >=0;i--){
            let casa = arrayElementos[i][coluna]
            if(casa.children.length === 0){
                casasDestacadas.push(casa)
            }else if(ehAdversario(casa)){
                casasDestacadas.push(casa)
                break
            }
            else{
                break
            }
        }

        //para baixo
        for(let i = linha + 1;i <8;i++){
            let casa = arrayElementos[i][coluna]
            if(casa.children.length === 0){
                casasDestacadas.push(casa)
            }else if(ehAdversario(casa)){
                casasDestacadas.push(casa)
                break
            }
            else{
                break
            }
        }
        //para esquerda
        for(let j = coluna - 1;j>=0;j--){
            let casa = arrayElementos[linha][j]
            if(casa.children.length === 0){
                casasDestacadas.push(casa)
            }else if(ehAdversario(casa)){
                casasDestacadas.push(casa)
                break
            }
            else{
                break
            }
        }
    
        //para direita
        for(let j = coluna +1;j<8;j++){
            let casa = arrayElementos[linha][j]
            if(casa.children.length === 0){
                casasDestacadas.push(casa)
            }else if(ehAdversario(casa)){
                casasDestacadas.push(casa)
                break
            }
            else{
                break
            }
        }
        peçaSelecionada = elemento;
        lancesPossiveis(casasDestacadas);
    }

    else if (elemento.className.includes('bispo-white') || elemento.className.includes('bispo-black')) {
        removerEventos();
        casasDestacadas = [];
        for(let [dx,dy] of direçaoBispo){
            let h = linha + dx
            let i = coluna + dy

            while(h >= 0 && h <8 && i >= 0 && i < 8){
                let casa = arrayElementos[h][i]
                if(casa.children.length === 0){
                    casasDestacadas.push(casa)
                }else if(ehAdversario(casa)){
                    casasDestacadas.push(casa)
                    break
                }
                else{
                    break
                }
                h += dx
                i += dy
            }
        }
        peçaSelecionada = elemento;
        lancesPossiveis(casasDestacadas);
    }

     else if (elemento.className.includes('cavalo-white') || elemento.className.includes('cavalo-black')) {
        removerEventos();
        casasDestacadas = [];
        let movimentos = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
        for(let [dx,dy] of movimentos){
            novaLinha = linha + dx
            novaColuna = coluna + dy
            if(novaLinha >= 0 && novaLinha <8 && novaColuna >= 0 && novaColuna<8){
                let casa = arrayElementos[novaLinha][novaColuna]
                if(casa.children.length === 0){
                    casasDestacadas.push(casa)
                }else if(ehAdversario(casa)){
                    casasDestacadas.push(casa)
                }
            }
        }
        
        peçaSelecionada = elemento;
        lancesPossiveis(casasDestacadas);
    }

    else if (elemento.className.includes('rainha-white') || elemento.className.includes('rainha-black')) {
        removerEventos();
        casasDestacadas = [];
        //para cima
        for(let i = linha -1;i >=0;i--){
            let casa = arrayElementos[i][coluna]
            if(casa.children.length === 0){
                casasDestacadas.push(casa)
            }else if(ehAdversario(casa)){
                casasDestacadas.push(casa)
                break
            }
            else{
                break
            }
        }

        //para baixo
        for(let i = linha + 1;i <8;i++){
            let casa = arrayElementos[i][coluna]
            if(casa.children.length === 0){
                casasDestacadas.push(casa)
            }else if(ehAdversario(casa)){
                casasDestacadas.push(casa)
                break
            }
            else{
                break
            }
        }
        //para esquerda
        for(let j = coluna - 1;j>=0;j--){
            let casa = arrayElementos[linha][j]
            if(casa.children.length === 0){
                casasDestacadas.push(casa)
            }else if(ehAdversario(casa)){
                casasDestacadas.push(casa)
                break
            }
            else{
                break
            }
        }
    
        //para direita
        for(let j = coluna +1;j<8;j++){
            let casa = arrayElementos[linha][j]
            if(casa.children.length === 0){
                casasDestacadas.push(casa)
            }else if(ehAdversario(casa)){
                casasDestacadas.push(casa)
                break
            }
            else{
                break
            }
        }
         for(let [dx,dy] of direçaoBispo){
            let h = linha + dx
            let i = coluna + dy

            while(h >= 0 && h <8 && i >= 0 && i < 8){
                let casa = arrayElementos[h][i]
                if(casa.children.length === 0){
                    casasDestacadas.push(casa)
                }else if(ehAdversario(casa)){
                    casasDestacadas.push(casa)
                    break
                }
                else{
                    break
                }
                h += dx
                i += dy
            }
        }
       
        peçaSelecionada = elemento;
        lancesPossiveis(casasDestacadas);
    }

    else if(elemento.className.includes('rei-white') || elemento.className.includes('rei-black')){
        removerEventos()
        casasDestacadas = []
        let movimentos = [[-1,0],[-1,-1],[-1,1],[0,-1],[0,1],[1,0],[1,-1],[1,1]]
        for(let [dx,dy] of movimentos){
            let novaLinha = linha + dx
            let novaColuna = coluna + dy
            if(novaLinha>=0 && novaLinha <8 && novaColuna >=0 && novaColuna <8){
                let casa = arrayElementos[novaLinha][novaColuna]
                if(casa.children.length === 0){
                    casasDestacadas.push(casa)
                }else if(ehAdversario(casa)){
                    casasDestacadas.push(casa)
                }
            }
        }
        peçaSelecionada = elemento
        lancesPossiveis(casasDestacadas)
     }
    }



// Execução principal
criarTabuleiro(grid);
let elementos = adicionarPeça(grid, 'peao-white', [6], [0, 1, 2, 3, 4, 5, 6, 7]);
adicionarPeça(grid,'peao-black',[1],[0,1,2,3,4,5,6,7])
adicionarPeça(grid,'torre-white',[7],[0,7])
adicionarPeça(grid,'torre-black',[0],[0,7])
adicionarPeça(grid,'bispo-white',[7],[2,5])
adicionarPeça(grid,'bispo-black',[0],[2,5])
adicionarPeça(grid,'cavalo-white',[7],[1,6])
adicionarPeça(grid,'cavalo-black',[0],[1,6])
adicionarPeça(grid,'rainha-white',[7],[4])
adicionarPeça(grid,'rainha-black',[0],[4])
adicionarPeça(grid,'rei-white',[7],[3])
adicionarPeça(grid,'rei-black',[0],[3])
grid.addEventListener('click', (event) => moverPeça(event, elementos));

