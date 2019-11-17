var clicks     = [];
var contPontos = 0;

//Inicializando tela onde serão plotados os
//desenhos
var canvas     = document.querySelector('canvas');
var context    = canvas.getContext('2d');

function getClicks(event){
    clicks.push({x: event.clientX, y: event.clientY});

    $('#pt'+contPontos+'x').val(event.clientX);
    $('#pt'+contPontos+'y').val(event.clientY);

    contPontos += 1;

    if(clicks.length > 0)
        plotaPontos();
     
    if(clicks.length == 4)
        desenhaCurva();
}

//Permite no maximo criar 4 pontos para a reta
if(contPontos <= 3)
    document.addEventListener("click", getClicks);

var pFinal = {}


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

//Desenha a curva de Bezier na tela seguindo
//os pontos escolhidos anteriormente
function desenhaCurva(){

    context.beginPath();
    context.moveTo(clicks[0].x, clicks[0].y);
    for(var t=0; t <= 1; t += 0.01){

        //Chama curva de Bezier para o parametro t e os pontos passados
        curvaBezier(clicks[0], clicks[1], clicks[2], clicks[3], t, pFinal);
        context.lineTo(pFinal.x, pFinal.y);

        //Plota para cada ponto uma circunferencia na tela
        //context.arc(pFinal.x, pFinal.y, 10, 1, Math.PI * 2, false);

        //Desenha a circunferencia
        
    }

    context.stroke();
}


/**
 * 
 * @param {Object} p0 - Primeiro ponto escolhido pelo usuário
 * @param {Object} p1 - Primeiro ponto escolhido pelo usuário
 * @param {Object} p2 - Primeiro ponto escolhido pelo usuário 
 * @param {Object} p3 - Primeiro ponto escolhido pelo usuário 
 * @param {int} t - Parâmetro da curva
 * @param {Object} pFinal - Ponto final da curva a ser plotado
 */
function curvaBezier(p0, p1, p2, p3, t, pFinal){
    pFinal = pFinal || {};
    pFinal.x = Math.pow(1 - t, 3) * p0.x + 
               Math.pow(1 - t, 2) * 3 * t * p1.x + (1 - t) * 3 * t * t * p2.x + t * t * t * p3.x;

    pFinal.y = Math.pow(1 - t, 3) * p0.y + 
               Math.pow(1 - t, 2) * 3 * t * p1.y + (1 - t) * 3 * t * t * p2.y + t * t * t * p3.y;

    return pFinal;
}