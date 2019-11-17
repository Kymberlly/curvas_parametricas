var clicks     = [];
var pFinal     = {};
var contPontos = 0;

//Inicializando tela onde serão plotados os desenhos
var canvas  = document.querySelector('canvas');
var context = canvas.getContext('2d');

/**
 * Pega os clicks que o usuário fez na tela
 * @param {event} event - Evento de click da tela
 */
function getClicks(event){
    //Permite criar, no maximo, 4 pontos para a curva de Bezier
    if(contPontos <= 3){
        clicks.push({x: event.clientX, y: event.clientY});

        $('#pt'+contPontos+'x').val(event.clientX);
        $('#pt'+contPontos+'y').val(event.clientY);

        contPontos += 1;

        //Ao registrar o primeiro click, plota na tela para visualização do usuário
        if(clicks.length <= 4)
            plotaPontos();
        
        //Se houverem 4 pontos, plota a curva de Bezier
        if(clicks.length == 4)
            desenhaCurva();
    }
}

//Esperando evento de click do mouse para adicionar 
//pontos e curva na tela
canvas.addEventListener("click", getClicks);

//Plota na tela os pontos clicados pelo usuário
function plotaPontos(){
    context.fillStyle = "#F50000";
    for(var i=0; i<contPontos; i++)
        context.fillRect(clicks[i].x, clicks[i].y, 5, 5);
}

/**
 * 
 * @param {Object} obj - Input a ser buscado o valor
 * @param {int} posicao - Posição no objeto de pontos que será alterada
 * @param {string} eixo - Eixo a ser movimentado
 */
function mudaPonto(obj, posicao, eixo){
    var jObj = $(obj);

    //Se o eixo for x, altera o valor do eixo x no objeto que esta na [posicao]
    if(eixo == 'x')
        clicks[posicao].x = parseInt(jObj.val());
    else 
        clicks[posicao].y = parseInt(jObj.val());

    context.clearRect(0, 0, canvas.width, canvas.height);
    plotaPontos();
    desenhaCurva();
}

//Limpa a tela de desenho e os campos de coordenadas
function limpaTela(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    contPontos = 0;
    clicks = [];
    $('.painel_controle input').val("");

}

//Desenha a curva de Bezier na tela seguindo
//os pontos escolhidos anteriormente
function desenhaCurva(){

    context.beginPath();

    //Move para o primeiro ponto a ser plotado na tela
    context.moveTo(clicks[0].x, clicks[0].y);

    for(var u=0; u <= 1; u += 0.01){
        //Chama curva de Bezier para o parametro t e os pontos passados
        curvaBezier(clicks[0], clicks[1], clicks[2], clicks[3], u, pFinal);

        //Desenha a linha no ponto calculado
        context.lineTo(pFinal.x, pFinal.y);
    }

    //Desenha a curva de Bezier
    context.stroke();
}


/**
 * 
 * @param {Object} p0 - Primeiro ponto escolhido pelo usuário
 * @param {Object} p1 - Segundo ponto escolhido pelo usuário
 * @param {Object} p2 - Terceiro ponto escolhido pelo usuário 
 * @param {Object} p3 - Quarto ponto escolhido pelo usuário 
 * @param {int} t - Parâmetro da curva
 * @param {Object} pFinal - Ponto final da curva a ser plotado
 */
function curvaBezier(p0, p1, p2, p3, u, pFinal){

    //Se o ponto final ja existir, utiliza ele para calcular
    //Se não existir, seta para um objeto vazio
    pFinal = pFinal || {};

    pFinal.x = Math.pow(1 - u, 3) * p0.x + 
               Math.pow(1 - u, 2) * 3 * u * p1.x + (1 - u) * 3 * u * u * p2.x + u * u * u * p3.x;

    pFinal.y = Math.pow(1 - u, 3) * p0.y + 
               Math.pow(1 - u, 2) * 3 * u * p1.y + (1 - u) * 3 * u * u * p2.y + u * u * u * p3.y;

    return pFinal;
}