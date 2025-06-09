import * as Utils from "./utils.js";
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
     let posicao = posiçaoRei(arrayElementos,corAtual)
     console.log(posicao)
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

