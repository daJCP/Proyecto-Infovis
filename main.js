const SVG1= d3.select("#vis-1").append("svg"); // MultiLineChart
const SVG2 = d3.select("#vis-2").append("svg"); // Circular Packing
const SVG_Selector = d3.select("#vis-selector").append("svg"); // Selector

const PL_Logo = 'https://www.premierleague.com/resources/rebrand/v7.133.4/i/elements/pl-main-logo.png'

// const PL_2023 = 'https://raw.githubusercontent.com/daJCP/Proyecto-Infovis/main/data/data_Procesada/premier_2022_2023.csv'
const PL_2023_Players = 'https://raw.githubusercontent.com/daJCP/Proyecto-Infovis/main/data/data_Procesada/premier_2022_2023_players.csv'
const PL_2023_STATS = 'https://raw.githubusercontent.com/daJCP/Proyecto-Infovis/main/data/data_Procesada/premier_2022_2023.csv'
const EV_PL = 'data\data_Procesada\proyecto_data_ev_table_premier_league_2022_2023.csv';
const FIFA = 'https://raw.githubusercontent.com/daJCP/Proyecto-Infovis/main/data/data_Procesada/proyecto_data_fifa_23.csv';
const data = 'https://raw.githubusercontent.com/daJCP/Proyecto-Infovis/main/data/data_Procesada/proyecto_data_ev_table_premier_league_2022_2023.json'

const premier_league_teams = {'Arsenal': '#ef0107',
'Aston Villa': '#490024',
'AFC Bournemouth': '#6d140e',
'Brentford': '#a47f0e',
'Brighton & Hove Albion': '#0000fd',
'Chelsea': '#004f97',
'Crystal Palace': '#9fbfdd',
'Everton': '#243bff',
'Fulham': '#5b5b5b',
'Leeds United': '#ddff2b',
'Leicester City': '#7866d5',
'Liverpool': '#00b2a9',
'Manchester City': '#6cabdd',
'Manchester United': '#fbe122',
'Newcastle United': '#241f20',
'Nottingham Forest': '#ffffff',
'Southampton': '#d8393e',
'Tottenham Hotspur': '#132257',
'West Ham United': '#7a263a',
'Wolverhampton Wanderers': '#fdb913'};


  
// <>>>>>><<<<<<<>>>>< Visualización 1 ><---------------------------------------------------------------><>>>>>><<<<<<<>>>><

// Tamaños
const scala = 0.7;
const WIDTH_VIS_1 = 1500*scala;
const HEIGHT_VIS_1 = 900*scala;

const MARGIN = {
    top: 0,
    bottom: 45,
    left: 45,
    right: 48,
  };

// Seteamos la primera visualización
SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);

// Creamos un contenedor para la visualización
const container2 = SVG1.append("g").attr(
    "transform",
    `translate(${MARGIN.left} ${MARGIN.top + MARGIN.bottom})`
);

// Función para comparar nombres entre datos
function extraerFotoNacionalidad(nombre, data_fifa) {
    let pais = nombre.split(' ')[0];
    let jugador = data_fifa.find(jugador => jugador.nationality === pais);

    return jugador ? jugador.photo : '';
}

// Función para comparar apellidos entre datos
function extraerYLimpiarApellido(nombre) {
    let nombreSinNumeros = nombre.replace(/[0-9]/g, '');
    let partes = nombreSinNumeros.split(' ');

    return partes[partes.length - 1].toLowerCase();
}

// Función permite reconocer un jugador dentro de un datast
function esMismaPersona(nombre1, nombre2) {      
    
    nombre1 = nombre1.trimStart();
    nombre2 = nombre2.trimStart();

    let apellido1 = extraerYLimpiarApellido(nombre1).trimStart();
    let apellido2 = extraerYLimpiarApellido(nombre2).trimStart();

    let inicial1 = nombre1[0].toLowerCase();
    let inicial2 = nombre2[0].toLowerCase();

    return apellido1 === apellido2 && inicial1 === inicial2 ;
}

// Función que permite revisar si la edad de un jugador es valida en otro dataset
function revisamosEdad(edad_fifa, edad_seleccionado) {
    edad_fifa = parseInt(edad_fifa);
    edad_seleccionado = parseInt(edad_seleccionado);

    return edad_fifa - 1 === edad_seleccionado || edad_fifa + 1 === edad_seleccionado || edad_seleccionado === edad_fifa;
}




// Cargamos la data 
loadingData();

function loadingData() {

    // Data de la evolución de la tabla de posiciones
    d3.json(data).then(d => {

        let data_ev = d.map(item => ({
            equipo: item.equipo,
            puntuaciones: item.puntuaciones,
        }
        ));
        
        // Data de los jugadores en el FIFA23
        d3.csv(FIFA).then(d => {

            let data_fifa = d.map(item => ({
                // ID,Name,Age,Photo,Nationality,Flag,Overall,Potential,Club,Club Logo
                id: item.ID,
                name: item.Name,
                age: item.Age,
                photo: item.Photo,
                nationality: item.Nationality,
                flag: item.Flag,
                overall: item.Overall,
                potential: item.Potential,
                club: item.Club,
                club_logo: item.ClubLogo,
                real_face: item.RealFace,
            }
            ));

            // Data de los jugadores en la Premier League 2022-2023
            d3.csv(PL_2023_Players).then(d => {

                let data_pl_2023_players = d.map(item => ({
                    // Player	Nation	Pos	Age	MP	Starts	Min	90s	Gls	Ast	G+A	G-PK	PK	PKatt	CrdY	CrdR	xG	npxG	xAG	npxG+xAG	PrgC	PrgP	PrgR	Gls	Ast	G+A	G-PK	G+A-PK	xG	xAG	xG+xAG	npxG	npxG+xAG	Matches	club
                    player: item.Player,
                    nation: item.Nation,
                    pos: item.Pos,
                    age: item.Age,
                    mp: item.MP,
                    starts: item.Starts,
                    min: item.Min,
                    x90s: item["90s"],
                    gls: item.Gls,
                    ast: item.Ast,
                    ga: item["G+A"],
                    gp: item["G-PK"],
                    pk: item.PK,
                    pkatt: item.PKatt,
                    crdy: item.CrdY,
                    crdr: item.CrdR,
                    xg: item.xG,
                    npxg: item.npxG,
                    xag: item.xAG,
                    club: item.club,
                }
                ));

                // Data de las estadisticas de los equipos en la Premier League 2022-2023
                d3.csv(PL_2023_STATS).then(d => {

                    let data_pl_2023_stats = d.map(item => ({
                        // Rk	Squad	MP	W	D	L	GF	GA	GD	Pts	Pts/MP	xG	xGA	xGD	xGD/90	Attendance	Top Team Scorer	Goalkeeper	Notes	link
                        rk: item.Rk,
                        squad: item.Squad,
                        mp: item.MP,
                        w: item.W,
                        d: item.D,
                        l: item.L,
                        gf: item.GF,
                        ga: item.GA,
                        gd: item.GD,
                        pts: item.Pts,
                        pts_mp: item["Pts/MP"],
                        xg: item.xG,
                        xga: item.xGA,
                        xgd: item.xGD,
                        xgd_90: item["xGD/90"],
                        attendance: item.Attendance,
                        top_team_scorer: item["Top Team Scorer"],
                        goalkeeper: item.Goalkeeper,
                        notes: item.Notes,
                        link: item.link
                    }
                    ));



                    

                    // const preprocesadosPLPlayers = data_pl_2023_players.map(seleccionado => ({
                    //     player: seleccionado.player,
                    //     edadValida: data_fifa.some(fifa_player => revisamosEdad(fifa_player.age, seleccionado.age))
                    // })).filter(seleccionado => seleccionado.edadValida);

                    // const data_filtrada = data_fifa.filter(fifa_player =>
                    //     preprocesadosPLPlayers.find(seleccionado =>
                    //         esMismaPersona(fifa_player.name, seleccionado.player)
                    //     )
                    // );


                    // Metodo Ilegal pero rapido
                    

                    let data_filtrada = data_fifa.filter(fifa_player => 
                        data_pl_2023_players.some(seleccionado =>
                            esMismaPersona(fifa_player.name, seleccionado.player) && revisamosEdad(fifa_player.age, seleccionado.age)
                        )
                    );



                    // let data_filtrada = data_fifa;

                    // Genemos la primera visualización y encadenamos la siguiente
                    createMultilineChart(data_ev, data_filtrada);
                    createSelector(data_ev, data_filtrada, data_pl_2023_players, data_pl_2023_stats);
                    
                    
                })
            })
        })
    })
}


// Primera visualización
function createMultilineChart(data, data_fifa) {
    
    const n = data[0].puntuaciones.length ;// Total de partidos
    const n_teams = data.length; // Total de equipos

    // console.log(n_teams,'Total Equipos');
    // console.log(n-1,'Total Fechas por equipo');

    // Grafico MultilineChart
    // Aplanamos la data para poder trabajarla
    const flattenedData = data.flatMap((equipo, equipoIndex) => 
    equipo.puntuaciones.map((puntuacion, index) => ({
        equipo,
        puntuacion,
        index: index 
    })));

    // Obtenemos los nombres de los equipos
    const equipos = d3.group(flattenedData, d => d.equipo);

    // Seleccionamos solo los equipos y su ultima posición
    const extraPoints = data.map(equipo => ({
        equipo,
        puntuacion: equipo.puntuaciones[ n - 1],
        index: n 
    }));

    // Creamos escalas
    const escalaX = d3.scaleLinear([0, n-1], [0, WIDTH_VIS_1 - MARGIN.left - MARGIN.right]); // Desde la fecha 0 a la fecha 38
    const escalaY = d3.scaleLinear([1, n_teams + 1], [0, HEIGHT_VIS_1 - 2 * MARGIN.bottom]); // Desde la posicion 19 a la 1

    
    // Secciones de clasificaciones
    // Sección Champions League
    SVG1.append("rect")
    .attr("x", WIDTH_VIS_1 - MARGIN.right) 
    .attr("y", MARGIN.top + MARGIN.bottom - (escalaY(2) - escalaY(1))/2 )
    .attr("width", escalaX(n+2) - escalaX(0) * 3)
    .attr("height", (escalaY(2) - escalaY(1))* 4) 
    .attr("fill", "#4dffff")
    .attr('opacity', 0.3); 
    SVG1.append("rect")
    .attr("x", WIDTH_VIS_1 - MARGIN.right) 
    .attr("y", MARGIN.top + MARGIN.bottom - (escalaY(2) - escalaY(1))/2 )
    .attr("width", 10)
    .attr("height", (escalaY(2) - escalaY(1))* 4) 
    .attr("fill", "#4dffff")
    .attr('opacity', 0.3); 
    
    // Sección Europa League
    SVG1.append("rect")
    .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
    .attr("y", MARGIN.top + MARGIN.left + escalaY(4.5)) 
    .attr("width", escalaX(n+2) - escalaX(0))
    .attr("height", (escalaY(2) - escalaY(1)) * 2) 
    .attr("fill", "#FAD660")
    .attr('opacity', 0.3); 
    SVG1.append("rect")
    .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
    .attr("y", MARGIN.top + MARGIN.left + escalaY(4.5)) 
    .attr("width", 10)
    .attr("height", (escalaY(2) - escalaY(1)) * 2) 
    .attr("fill", "#FAD660")
    .attr('opacity', 0.3);
    
    // // Sección WestHam United (Teoricamente deberia ser verd, ya que, la ganó ese año)
    
    // SVG1.append("rect")
    //     .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
    //     .attr("y", MARGIN.top + MARGIN.left + escalaY(13.5)) 
    //     .attr("width", escalaX(n+2) - escalaX(0))
    //     .attr("height", (escalaY(2) - escalaY(1))) 
    //     .attr("fill", "green")
    //     .attr('opacity', 0.3); 
    // SVG1.append("rect")
    //     .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
    //     .attr("y", MARGIN.top + MARGIN.left + escalaY(13.5)) 
    //     .attr("width", 10)
    //     .attr("height", (escalaY(2) - escalaY(1))) 
    //     .attr("fill", "green")
    //     .attr('opacity', 0.3);
    
    
    // Sección Europa Conference League
    SVG1.append("rect")
    .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
    .attr("y", MARGIN.top + MARGIN.left + escalaY(6.5)) 
    .attr("width", escalaX(n+2) - escalaX(0))
    .attr("height", (escalaY(2) - escalaY(1))) 
    .attr("fill", "green")
    .attr('opacity', 0.3); 
    SVG1.append("rect")
    .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
    .attr("y", MARGIN.top + MARGIN.left + escalaY(6.5)) 
    .attr("width", 10)
    .attr("height", (escalaY(2) - escalaY(1))) 
    .attr("fill", "green")
    .attr('opacity', 0.3); 
    
    
    // Sección Nada
    SVG1.append("rect")
        .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
        .attr("y", MARGIN.top + MARGIN.left + escalaY(7.5)) 
        .attr("width", escalaX(n+2) - escalaX(0))
        .attr("height", (escalaY(2) - escalaY(1)) * 7) 
        .attr("fill", "white")
        .attr('opacity', 0.3); 
    SVG1.append("rect")
        .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
        .attr("y", MARGIN.top + MARGIN.left + escalaY(7.5)) 
        .attr("width", 10)
        .attr("height", (escalaY(2) - escalaY(1))*7) 
        .attr("fill", "white")
        .attr('opacity', 0.3); 
    
    SVG1.append("rect")
        .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
        .attr("y", MARGIN.top + MARGIN.left + escalaY(14.5)) 
        .attr("width", escalaX(n+2) - escalaX(0))
        .attr("height", (escalaY(2) - escalaY(1)) * 3) 
        .attr("fill", "white")
        .attr('opacity', 0.3); 
    SVG1.append("rect")
    .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
    .attr("y", MARGIN.top + MARGIN.left + escalaY(14.5)) 
    .attr("width", 10)
    .attr("height", (escalaY(2) - escalaY(1))*3) 
    .attr("fill", "white")
    .attr('opacity', 0.3); 
    
    // Sección Relegation
    SVG1.append("rect")
    .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
    .attr("y", MARGIN.top + MARGIN.left + escalaY(17.5)) 
    .attr("width", escalaX(n+2) - escalaX(0))
    .attr("height", (escalaY(2) - escalaY(1)) * 3) 
    .attr("fill", "red")
    .attr('opacity', 0.3); 
    SVG1.append("rect")
    .attr("x", WIDTH_VIS_1 - escalaX(0) - MARGIN.right) 
    .attr("y", MARGIN.top + MARGIN.left + escalaY(17.5)) 
    .attr("width", 10)
    .attr("height", (escalaY(2) - escalaY(1))*3) 
    .attr("fill", "red")
    .attr('opacity', 0.3); 
    
    
    // Creamos ejes
    const ejeX = d3.axisBottom(escalaX).ticks(n);
    const ejeY = d3.axisLeft(escalaY).ticks(n_teams).tickFormat(d => d < 21 ? d : '');
    
    // Agregamos ejes
    // Agregamos Label eje X
    SVG1.append('g')
    .attr("class", "x-axis")
    .attr("transform",`translate(${MARGIN.left}, ${MARGIN.top + HEIGHT_VIS_1 - MARGIN.bottom})`)
    .call(ejeX)
    .selectAll("line")
    .attr("y1", -(HEIGHT_VIS_1 - MARGIN.bottom - MARGIN.top - MARGIN.bottom))
    .attr("stroke-dasharray", "5")
    .attr("opacity", 0.4);
    SVG1.append("text")
    .attr("class", "axis-label")
    .attr("x", 0 )
    .attr("y", 0 )
    .attr("transform", `translate(${ WIDTH_VIS_1 / 2}, ${HEIGHT_VIS_1 - MARGIN.bottom + MARGIN.top + 20 * 2})`)
    .style("text-anchor", "middle")
    .text("Jornada de la Liga");
    
    // Agregamos Label eje Y
    SVG1.append('g')
    .attr("class", "y-axis")
    .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top + MARGIN.bottom})`)
    .call(ejeY)
    .selectAll("line")
    .attr("x1", WIDTH_VIS_1 - MARGIN.left - MARGIN.right)
    .attr("stroke-dasharray", "5")
    .attr("opacity", 0.4);
    SVG1.append("text")
    .attr("class", "axis-label")
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", `translate(${MARGIN.left - 27}, ${HEIGHT_VIS_1/2}) rotate(-90)`)
    .style("text-anchor", "middle")
    .text("Posición en la Tabla");
    
    
    // Creamos lineas
    let lines = d3.line()
        .x(d => escalaX(d.index )) 
        .y(d => escalaY(d.puntuacion));
        
    // Lo que va dentro de la visualización
    container2.selectAll('path')
        .data(equipos)
        .join('path')
        .attr('d', ([d, val]) => lines(val)) 
        .attr('fill', 'none')
        .attr('stroke', ([key]) => premier_league_teams[key.equipo])
        .attr('stroke-width', 4);

    // Lo tiramos al frente
    container2.raise();

    // Agregamos los circulos
    container2.selectAll("circle")
        .data(flattenedData)
        .join("circle")
        .attr("r", 5)
        .attr("fill",  (d) => premier_league_teams[d.equipo.equipo])
        .attr("cx", (d) => escalaX(d.index ))
        .attr("cy", (d) => escalaY(d.puntuacion));
    
    // Agregamos los Logo de los clubes    
    SVG1.selectAll("image.extra")
        .data(extraPoints)
        .join("image")
        .attr("class", "extra")
        .attr("width", escalaY(2) - escalaY(1))  
        .attr("height", escalaY(2) - escalaY(1)) 
        .attr("href", d => data_fifa.filter(a => a.club === d.equipo.equipo)[0].club_logo) 
        .attr("x", d => escalaX(d.index) + MARGIN.left - 20) 
        .attr("y", d => escalaY(d.puntuacion) + MARGIN.top + MARGIN.bottom - (escalaY(2) - escalaY(1))/2); 
      
    
    // ClipPath para setear margenes para el zoom
    let clip = SVG1.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", WIDTH_VIS_1 - MARGIN.left - MARGIN.right + 20) 
        .attr("height", HEIGHT_VIS_1 - MARGIN.top - MARGIN.bottom )
        .attr("x", MARGIN.left - MARGIN.right + 5  )
        .attr("y", MARGIN.top-10);

    // ClipPath a los elementos que no deben superponerse sobre los ejes
    container2.attr("clip-path", "url(#clip)");

    // Efecto de zoom
    const zoom = d3.zoom()
        .scaleExtent([1, 39])
        .translateExtent([
            [0,0 ], 
            [WIDTH_VIS_1- MARGIN.left - MARGIN.right +95, HEIGHT_VIS_1 - MARGIN.top - MARGIN.bottom]
        ])
        .on("zoom", zoomed);

    SVG1.call(zoom);

    // Función que se llama cuando se hace zoom
    const formatTicks = d => Math.ceil(d) === d ? d : ""; // Discreto
    function zoomed(event) {
        // Nueva escala del eje X
        const newXescala = event.transform.rescaleX(escalaX);

        // Actualiza el eje X con el formato personalizado
        SVG1.select(".x-axis")
            .call(d3.axisBottom(newXescala)
            .tickValues(d3.range(0, n, 1).filter(d => newXescala(d) >= 0 && newXescala(d) <= WIDTH_VIS_1))
            .tickFormat(formatTicks))
            .selectAll("line")
            .attr("y1", -(HEIGHT_VIS_1 - MARGIN.bottom - MARGIN.top - MARGIN.bottom))
            .attr("stroke-dasharray", "5")
            .attr("opacity", 0.4);

        SVG1.selectAll("image.extra")
            .transition()
            .duration(500)
            .attrTween("y", function(d) {
                // Efecto movimiento logos equipos
                const lastPoint = flattenedData.filter(p => p.equipo.equipo === d.equipo.equipo && newXescala(p.index) <= WIDTH_VIS_1 - MARGIN.right).pop();
                const posicionY = d3.select(this).attr("y");
                let destinoY;
            
                if (lastPoint) {
                    destinoY = escalaY(lastPoint.puntuacion) + MARGIN.top + MARGIN.bottom - (escalaY(2) - escalaY(1))/2;
                } else {
                    destinoY = posicionY;
                }
            
                // Retornamos animación entre ambas posiciones
                return  d3.interpolateNumber(posicionY, destinoY);
        
            });


        // Actualiza las líneas y puntos para que coincidan con la nueva escala
        lines.x(d => newXescala(d.index));
        container2.selectAll('path').attr('d', ([d, val]) => lines(val));
        container2.selectAll("circle").attr("cx", (d) => newXescala(d.index ));

    }
}

// !!
// <>>>>>><<<<<<<>>>>< Visualización 2 ><---------------------------------------------------------------><>>>>>><<<<<<<>>>><

// Tamaños
const WIDTH_VIS_Selector = 1200;
const HEIGHT_VIS_Selector = 100;

// Seteamos el nuevo SVG para el selector
SVG_Selector.attr("width", WIDTH_VIS_Selector).attr("height", HEIGHT_VIS_Selector);

// Función para crear el selector
function createSelector(data, data_fifa, data_pl_2023_players, data_pl_2023_stats) {

    // Selector de equipo
    const selected = new Set();

    // Inicializamos visualización 2
    createStats(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, selected);
    

    // Cantidad de equipos
    const n =  data.length;
    // Data de los equipos
    const extraPoints = data.map(equipo => ({
        equipo,
        puntuacion: equipo.puntuaciones[ n - 1],
        index: n
    }));


    // Añadimos un cuadrado de background al SVG_Selector
    SVG_Selector.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', WIDTH_VIS_Selector)
        .attr('height', HEIGHT_VIS_Selector)
        .style('fill', '#1a1a1a') 
        .style('stroke', 'gray')
        .style('stroke-width', '7px') 
        .attr('rx', 29) 
        .attr('ry', 29); 

    // Creamos escala para dividir el cuadro en los n equipos
    let escalaEquipos = d3.scaleLinear([0, n + 1], [WIDTH_VIS_Selector/n, WIDTH_VIS_Selector]);

    // Añadimos los Logo de los clubes 

    // Tamaño de la imagen
    const img_scale = 1;

    // La añadimos al SVG
    SVG_Selector.selectAll("image")
        .data(extraPoints)
        .join("image")
        .attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
        .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
        .attr("href", d => data_fifa.filter(a => a.club === d.equipo.equipo)[0].club_logo)
        .attr("x", (d, i) => escalaEquipos(i+1) - ((escalaEquipos(2) - escalaEquipos(1))/2)*img_scale)
        .attr("y", (escalaEquipos(2) - escalaEquipos(1))/2 * img_scale);
    // Añadimos el logo de la premier league
    SVG_Selector.append("image")
        .attr('class', 'premier_league')
        .attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
        .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
        .attr("href", PL_Logo)
        .attr("x",  ((escalaEquipos(2) - escalaEquipos(1)))*0.5*img_scale)
        .attr("y", (escalaEquipos(2) - escalaEquipos(1))/2 * img_scale);
    
    // Efecto selección circulo
    function highlightTeam(selected) {
        // Aumenta la opacidad del equipo seleccionado y baja las del resto
        container2.selectAll('path')
            .attr('opacity',  d => selected.has(d[0].equipo) ? 1 : 0.1);
        container2.selectAll('circle')
            .attr('opacity',  d => selected.has(d.equipo.equipo) ? 1 : 0.1);
        SVG1.selectAll("image.extra")
            .attr('opacity',  d => selected.has(d.equipo.equipo) ? 1 : 0.3);
        
    }

    // Reset del selector
    function resetVisualization(selected) {
        selected.clear();
        container2.selectAll('path')
            .attr('opacity', 1);
        container2.selectAll('circle')
            .attr('opacity', 1);
        SVG1.selectAll("image.extra")
            .attr('opacity', 1);
    }

    // Efecto del selector
    SVG_Selector.selectAll("image:not(.premier_league)")
        .on('click', (evento, d) => {
            // Revisamos si ya esta dentro de los seleccionados
            if (selected.has(d.equipo.equipo)) {
                selected.delete(d.equipo.equipo);
            } else {
                selected.add(d.equipo.equipo);
            }

            // Al clickear y tener un equipo seleccionado se gatilla la visualización
            createStats(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, selected, d.equipo.equipo);

            // Cambiamos el texto del selector
            let texto = `Datos ${Array.from(selected)
                .map(team => `<span style="color: ${premier_league_teams[team]};
                 text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;">${team}</span>`)
                .join(', ')} - Premier League 2022/2023 `;
            d3.selectAll("#selected").html(texto);
            if (selected.size === 0) {
                resetVisualization(selected);
            }
            else {
                highlightTeam(selected);
            }
            
        });
    // Al clickear en la premier league se resetea la visualización
    SVG_Selector.selectAll("image.premier_league")
        .on('click', () => {
            let texto = `Datos Premier League`;
            d3.selectAll("#selected").text(texto);
            resetVisualization(selected);
            createStats(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, selected);
        });

    // Hacer más ancha la image al poner mouse encima
    SVG_Selector.selectAll("image:not(.premier_league)")
        .on("mouseover", function() {
            d3.select(this).attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale * 1.5)
            .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale * 1.5);
            d3.select(this).raise();
            d3.select(this).attr('transform', `translate(-10,-20)`);
        })
        .on("mouseout", function() {
            d3.select(this).attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
            .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale);
            d3.select(this).attr('transform', `translate(0,-20)`);
            d3.select(this).transition().duration(1000*0.1).attr('transform', `translate(0,0)`);
        });
    
    SVG_Selector.selectAll("image.premier_league")
        .on("mouseover", function() {
            d3.select(this).attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale * 1.5)
            .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale * 1.5);
            d3.select(this).raise();
            d3.select(this).attr('transform', `translate(-10,-20)`);
        })
        .on("mouseout", function() {
            d3.select(this).attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
            .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale);
            d3.select(this).attr('transform', `translate(0,-20)`);
            d3.select(this).transition().duration(1000*0.1).attr('transform', `translate(0,0)`);
        }); 

    // Añadimos tooltip para nombre equipo en el selector
    let tooltip = d3.select("#tooltip");

    SVG_Selector.selectAll("image:not(.premier_league)")
        .on("mouseover", function(event, d) {
            // Mostramos tooltip
            tooltip.style("visibility", "visible")
                    .text(d.equipo.equipo);
            // Actualiza la imagen como antes
            d3.select(this).attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale * 1.5)
                .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale * 1.5)
                .attr('transform', `translate(-10,-20)`);
            d3.select(this).raise();
        })
        .on("mousemove", function(event) {
            // Movemos tooltip
            tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            // Escondemos tooltip
            tooltip.style("visibility", "hidden");
            // Restaura la imagen como antes
            d3.select(this).attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
                .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
                .transition().duration(1000*0.1).attr('transform', `translate(0,0)`);
        });

    SVG_Selector.select("image.premier_league")
        .on("mouseover", function(event, d) {
            // Mostramos tooltip
            tooltip.style("visibility", "visible")
                    .text("Premier league"); // Asumiendo que d.equipo.equipo contiene el nombre del equipo
            // Actualiza la imagen como antes
            d3.select(this).attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale * 1.5)
                .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale * 1.5)
                .attr('transform', `translate(-10,-20)`);
            d3.select(this).raise();
        })
        .on("mousemove", function(event) {
            // Movemos tooltip
            tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            // Escondemos tooltip
            tooltip.style("visibility", "hidden");
            // Restaura la imagen como antes
            d3.select(this).attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
                .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
                .transition().duration(1000*0.1).attr('transform', `translate(0,0)`);
        });
}

// !!
// Seteamos los margenes de las visualizaciones
const MARGIN_2 = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };
const MARGIN_3 = {
    top: 60,
    bottom: 10,
    left: 10,
    right: 60,
};
const scala_2 = 0.8;
const WIDTH_VIS_2 = 1250;
const HEIGHT_VIS_2 = 600;

// Seteamos la visualización 2 en el SVG
SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);


// Función para crear la visualización 2
function createStats(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, selected,name_selected) {

    let semiWidth = WIDTH_VIS_2 / 2;
    let semiHeight = HEIGHT_VIS_2 / 2;

    // Main Background
    SVG2.append("rect")
        .attr("x", 0) 
        .attr("y", 0)
        .attr("width", WIDTH_VIS_2)
        .attr("height", HEIGHT_VIS_2) 
        .attr("fill", "purple");

    // Background    
    SVG2.append('rect')
        .raise()
        .attr('x', MARGIN_2.left)
        .attr('y', MARGIN_2.top)
        .attr('width', WIDTH_VIS_2- MARGIN_2.left -  MARGIN_2.right)
        .attr('height', HEIGHT_VIS_2- MARGIN_2.top - MARGIN_2.bottom)
        .attr('fill', 'black');

    // Cuadrilla derecha
    createStatsRight(0,0,0,0,0,0,0,0,0)

    // Cuadrilla izquierda
    SVG2.append('rect')
        .attr("x", MARGIN_3.left*2)
        .attr("y", MARGIN_3.top*2)
        .attr("width", semiWidth - MARGIN_3.left*4)
        .attr("height", HEIGHT_VIS_2-MARGIN_3.bottom*2 - MARGIN_3.top*2)
        .style("stroke", "purple")
        .style("stroke-width", 5)
        .raise();
    
    let pack = d3.pack()
        .size([semiWidth - MARGIN_3.left*4, HEIGHT_VIS_2-MARGIN_3.bottom*2 - MARGIN_3.top*2])
        .padding(2);

    // data_pl_2023_players extrae los que tengan de nombre de equipo en selected
    // Gatillamos reset de todos si no hay ninguno seleccionado
    let data_pl_2023_players_selected
    if (selected.size === 0) {
        data_pl_2023_players_selected = data_pl_2023_players;
    }
    else{
        data_pl_2023_players_selected = data_pl_2023_players.filter(d => selected.has(d.club));
    }

    // Obtenemos la data de fifa filtrada por jugadores
    if (selected.size < 0) {
        data_filtrada = data_fifa;
    }
    else{
        data_filtrada = data_fifa
            .filter(fifa_player =>
                data_pl_2023_players_selected.some(seleccionado =>
                esMismaPersona(fifa_player.name, seleccionado.player) && revisamosEdad(fifa_player.age, seleccionado.age)
                )
            )
            .map(fifa_player => {
                // Encontrar el objeto seleccionado correspondiente
                let seleccionado = data_pl_2023_players_selected.find(selec =>
                esMismaPersona(fifa_player.name, selec.player) && revisamosEdad(fifa_player.age, selec.age)
                );
                // Retornar una copia del jugador con el club actualizado y añadida su foto
                return {
                ...fifa_player,
                club: seleccionado ? seleccionado.club : fifa_player.club,
                foto: fifa_player.photo
                };
            });
    }

    // Limpiar elementos existentes
    SVG2.selectAll(".node").remove();

    // Generar data jerarquizada para el pack layout
    let dataHierarchy = {
        name: "equipos",
        children: Array.from(
          // Agrupar por equipo
          d3.group(data_filtrada, d => d.club), 
          ([name, players]) => ({
            name,
            children: Array.from(
              // Agrupar por nacionalidad dentro de cada equipo
              d3.group(players, d => d.nationality),
              ([name, players]) => ({
                name,
                players: players,
                flag: players[0].flag,
                value: players.length // El tamaño del círculo será proporcional al número de jugadores
              })
            )
          })
        )
      };

    // Seteamos el root de la data
    var root = d3.hierarchy(dataHierarchy)
      .sum(d => d.value);
    pack(root);

    // Crear patrones para las banderas en los circulos
    SVG2.selectAll("patterns")
      .data(root.descendants().filter(d => d.depth === 2))
      .enter()
      .append("pattern")
      .attr("id", d => "flag-pattern-" + d.data.name.replace(/\s+/g, '-'))
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("patternContentUnits", "objectBoundingBox")
      .append("image")
      .attr("xlink:href", d => d.data.flag)
      .attr("width", 1)
      .attr("height", 1)
      .attr("preserveAspectRatio", "xMidYMid slice");

    // Unir los datos a los nodos existentes
    let node = SVG2.selectAll(".node")
        .data(root.descendants(), d => d.data.name);

    // Enter para nuevos nodos
    let nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("opacity", 0);
    // Circulo por cada nodo
    nodeEnter.append("circle")
        .attr("r", d => d.r)
        .style("fill", d => {
            if (d.depth === 2) { // Si el nodo representa una nacionalidad
                return `url(#flag-pattern-${d.data.name.replace(/\s+/g, '-')})`;
            }
            return d.depth === 1 ? premier_league_teams[d.data.name] || "black" : "#3d195b";
        })
        .style("stroke", "purple");

    // Merge para elementos existentes y nuevos
    node = nodeEnter.merge(node);

    // Actualizamos todos los nodos existentes y nuevos
    node.transition()
        .duration(600)
        .attr("transform", d => `translate(${d.x + MARGIN_3.left*2}, ${d.y + MARGIN_3.top*2})`)
        .attr("opacity", 1)
        .select("circle")
        .attr("r", d => d.r)
        .style("fill", d => {
            if (d.depth === 2) {
                return `url(#flag-pattern-${d.data.name.replace(/\s+/g, '-')})`; // Usa el patrón de bandera
            }
            return d.depth === 1 ? premier_league_teams[d.data.name] || "black" : "#3d195b"; // Usa un color sólido para otros nodos
        })

    node.selectAll("circle")
        .on("mouseover", function(event, d) {
            // Seteamos tooltip
            let content = "";
            let texto = '';
            // Verificar la profundidad del nodo y actualizar el contenido del tooltip
            if (d.depth === 0) { 
                content = `Datos: ${Array.from(d.data.children)
                    .map(team=> `${team.name}`)
                    .join(' - ')}`;
            } else if (d.depth === 1) {
                content = `${d.data.name}`;
            } else if (d.depth === 2) {
                texto = `${Array.from(d.data.players)
                    .map(player=> `${player.name}`)
                    .join(', ')}`;
                content = `Nacionalidad: ${d.data.name}<br>Jugadores: ${d.value}<br> ${texto}`;
            }

            // Mostrar el tooltip con el contenido actualizado
            d3.select("#tooltip")
                .style("visibility", "visible")
                .html(content);
        })
        .on("mousemove", function(event, d) {
            // Mover el tooltip
            d3.select("#tooltip")
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            // Ocultar el tooltip
            d3.select("#tooltip").style("visibility", "hidden")
        });
    
    // Efecto de click en los circulos
     node.selectAll("circle")
        .on("click", function(event, d) {
            if (d.depth === 1) { 
                createStatsRight(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, dataHierarchy, selected, data_filtrada, 1, d.data.name);
                createStatsRight(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, dataHierarchy, selected, data_filtrada, 1, d.data.name);
                // Añade la clase 'selected-circle' al círculo clickeado
                SVG2.selectAll("circle").classed("selected-circle", false);
                d3.select(this).classed("selected-circle", true);
            }
        });

    // Añadimos un titulo sobre el cuadrado izquierdo
    SVG2.append("text")
        .attr("x", MARGIN_3.left + 15)
        .attr("y", MARGIN_3.top + MARGIN_2.top * 2)
        .attr("text-anchor", "left")
        .attr("font-size","34px")
        .attr("fill", "white")
        .text("Jugadores por Equipo y Nacionalidad");

    // Gatillamos visualizacion 3
    if (selected.size === 1) {
        createStatsRight(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, dataHierarchy, selected, data_filtrada, 1, name_selected);
        createStatsRight(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, dataHierarchy, selected, data_filtrada, 1, name_selected);
    }



}
// !!
// <>>>>>><<<<<<<>>>>< Visualización 3 ><---------------------------------------------------------------><>>>>>><<<<<<<>>>><


function createStatsRight(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, dataHierarchy, selected, data_filtrada, inicio, selected_team){

    // Añadimos un cuadrado a la derecha
    if (inicio === 0) {
        SVG2.append('rect')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left)
            .attr("y", MARGIN_3.top*2)
            .attr("width", WIDTH_VIS_2/2 - MARGIN_3.left*3)
            .attr("height", HEIGHT_VIS_2-MARGIN_3.bottom*2 - MARGIN_3.top*2)
            .style("stroke", "purple")
            .style("stroke-width", 5);

        // Añadir al svg2 objeto de imagen de la premier league default
        SVG2.append("image")
            .attr('id', 'goleador-foto')
            .attr("xlink:href", PL_Logo)
            .attr("width", 200)
            .attr("height", 200)
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*38)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 20.5)
        
        // Titulo Instruccion
        SVG2.append("text")
        .attr("id", "equipo")
        .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left+20)
        .attr("y", MARGIN_3.top + MARGIN_2.top * 1.5)
        .attr("text-anchor", "left")
        .attr("font-size", "30px")
        .attr("fill", "white")
        .text('Click circulo del equipo para ver estadísticas');
        
        // Rectangulo rendimiento
        SVG2.append('rect')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*2)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 7)
            .attr("width", 300)
            .attr("height", 230)
            .style("fill", "purple");
        SVG2.append("text")
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*3)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 8.5)
            .attr("text-anchor", "left")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("Rendimiento del Equipo:");
        
        // Rectangulo rendimiento
        SVG2.append('rect')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*34)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 7)
            .attr("width", 255)
            .attr("height", 105)
            .style("fill", "purple");

        // Rectangulo puntos
        SVG2.append('rect')
            .attr('id', 'pts-din')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*34 + 255/1.8)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 7)
            .attr("width", 115)
            .attr("height", 105)
            .style("fill", "grey");

        SVG2.append("text")
            .attr('id', 'pts')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*35)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 8.5)
            .attr("text-anchor", "left")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("Puntos obtenidos");

        // Rectangulo puntos
        SVG2.append("text")
            .attr('id', 'pts-din')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*40)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "35px")
            .attr("fill", "white")
            .text("0");
            
        SVG2.append("text")
            .attr('id', 'rk')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*51)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 8.5)
            .attr("text-anchor", "right")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("Posicion");

        SVG2.append("text")
            .attr('id', 'rk-din')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*54)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "35px")
            .attr("fill", "white")
            .text("0");

        SVG2.append('rect')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*2)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 38)
            .attr("width", 370-5)
            .attr("height", 105)
            .style("fill", "purple");

        SVG2.append('rect')
            .attr('id', 'rect-gf')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*2 + 370/3*2 - 5)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 38)
            .attr("width", 370/3)
            .attr("height", 105)
            .style("fill", "grey");

        SVG2.append("text")
            .attr('id', 'gf') // Goles a favor
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*2.5)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 40)
            .attr("text-anchor", "left")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("Goles a favor");

        SVG2.append("text")
            .attr('id', 'ga') // Goles en contra
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*13)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 40)
            .attr("text-anchor", "left")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("Goles en contra");


        SVG2.append("text")
            .attr('id', 'gd') // Goles diferencia
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*27)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 40)
            .attr("text-anchor", "left")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("Diferencia Goles");

        SVG2.append("text")
            .attr('id', 'gf-din') // Goles a favor
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*7)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 45)
            .attr("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("fill", "white")
            .text("0");

        SVG2.append("text")
            .attr('id', 'ga-din') // Goles en contra
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*18)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 45)
            .attr("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("fill", "white")
            .text("0");


        SVG2.append("text")
            .attr('id', 'gd-din') // Goles diferencia
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*32)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 45)
            .attr("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("fill", "white")
            .text("0");

        SVG2.append("text")
            .attr('id', 'top_scorer')
            .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left*33)
            .attr("y", MARGIN_3.top + MARGIN_2.top * 20)
            .attr("text-anchor", "left")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("Goleador:");

        return;
    }

    let cuadradoCentroX = WIDTH_VIS_2/2 + MARGIN_3.left + (WIDTH_VIS_2/2 - MARGIN_3.left*3) / 2;
    let cuadradoCentroY = MARGIN_3.top*2 + (HEIGHT_VIS_2 - MARGIN_3.bottom*2 - MARGIN_3.top*2) / 2;

    // Obtenemos la data del equipo seleccionado
    let teamData = data_pl_2023_stats.filter(d => d.squad.trimStart() === selected_team.trimStart())[0];

    // Metricas a proyectar 
    let metricass = ['w', 'd', 'l', 'gf', 'ga', 'gd', 'xg', 'xga', 'xgd', 'xgd_90', 'pts'];

    // console.log(teamData, 'data_pl_2023_stats_selected');

    // Calculamos los totales y porcentajes
    let totalGames = parseInt(teamData.w) + parseInt(teamData.d) + parseInt(teamData.l);
    let pieData = [
        {name: 'Win', value: parseInt(teamData.w) / totalGames},
        {name: 'Draw', value: parseInt(teamData.d) / totalGames},
        {name: 'Lose', value: parseInt(teamData.l) / totalGames}
    ];

    // Configuración del gráfico de torta
    let radius = 100; 
    let arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
    let pie = d3.pie().sort(null).value(d => d.value);

    // Dibuja el gráfico de torta

    let g = SVG2.selectAll(".pieChartGroup").data([pieData]);

    // Enter para nuevos elementos
    let gEnter = g.enter().append("g")
        .attr("class", "pieChartGroup")
        .attr("transform", `translate( ${cuadradoCentroX - (WIDTH_VIS_2/2 - MARGIN_3.left*3)/4 + 10}  ${cuadradoCentroY - (HEIGHT_VIS_2-MARGIN_3.bottom*2 - MARGIN_3.top*2)/4 + 10} )`);

    // Merge para elementos existentes
    g = gEnter.merge(g);

    // Trabaja con los arcos
    let arcs = g.selectAll(".arc")
        .data(d => pie(d), d => d.data.name);

    // Enter para nuevos arcos
    arcs.enter().append("path")
        .attr("class", "arc")
        .style("fill", d => {
            switch(d.data.name) {
                case 'Win': return "green";
                case 'Draw': return "#ffc61a";
                case 'Lose': return "red";
            }
        })
        .each(function(d) { this._current = d; }); 

    // Update para arcos existentes
    arcs.transition().duration(1000)
        .attrTween("d", function(d) {
            let interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return t => arc(interpolate(t));
        });

    // Remove para arcos que ya no son necesarios
    arcs.exit();
    g.raise();

    // Seleccionamos etiquetas de texto
    let text = g.selectAll("text")
        .data(pie(pieData), d => d.data.name);

    // Enter para nuevas etiquetas
    text.enter().append("text")
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .each(function(d) { this._current = d; });

    // Update para etiquetas existentes
    text.transition().duration(1000)
        .attrTween("transform", function(d) {
            let interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                let d2 = interpolate(t);
                let pos = arc.centroid(d2);
                pos[0] = pos[0] * 2; 
                pos[1] = pos[1] * 2;
                return "translate(" + pos + ")";
            };
        })
        .text(function(d) {
            let percentage = d.data.name === 'Win' ? parseInt(teamData.w)/totalGames : d.data.name === 'Draw' ? parseInt(teamData.d)/totalGames : parseInt(teamData.l)/totalGames;
            percentage = Math.round(percentage * 100) + "%";
            let absoluteValue = d.data.name === 'Win' ? teamData.w : d.data.name === 'Draw' ? teamData.d : teamData.l;
            return d.data.name + ": " + absoluteValue + " (" + percentage + ")";
        });

    

    
    // Añadimos un titulo sobre el cuadrado derecho
    SVG2.append("text")
        .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left)
        .attr("y", MARGIN_3.top + MARGIN_2.top * 0.5)
        .attr("text-anchor", "left")
        .attr("font-size", "30px")
        .attr("fill", "white")
        .text("Datos - Premier League 2022/2023");
    SVG2.selectAll("text#equipo")
        .attr("x", WIDTH_VIS_2/2 + MARGIN_3.left)
        .attr("y", MARGIN_3.top + MARGIN_2.top * 4)
        .attr("text-anchor", "left")
        .attr("font-size", "30px")
        .attr("fill", premier_league_teams[selected_team]) 
        .text(selected_team)
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5);

    // Actualizamos data a mostrar
    SVG2.selectAll("text#pts-din")
        .text(teamData.pts);

    SVG2.selectAll("text#rk-din")
        .text(teamData.rk);

    SVG2.selectAll("text#gf-din")
        .text(teamData.gf);

    SVG2.selectAll("text#ga-din")
        .text(teamData.ga);

    SVG2.selectAll("text#gd-din")
        .text(teamData.gd);

    function clasificacion(posicion){

        posicion = parseInt(posicion);
        let color = '';
        
        if (posicion >= 1 && posicion <= 4){
            color = '#38bdc2';
        }
        else if (posicion >= 5 && posicion <= 6){
            color =  '#FAD660';
        }
        else if (posicion === 7){
            color =  'green';
        }
        else if (posicion >= 8 && posicion <= 17){
            color =  'grey'
        }
        else if(posicion >= 18 ){
            color =  'red';
        }

        return color;
    }

    function dif_goals(gd){
        let color = '';
        gd = parseInt(gd);
        if (gd > 0){
            color = 'green';
        }
        else if (gd === 0){
            color = 'grey';
        }
        else{
            color = 'red';
        }

        return color;
    }
    
    
    SVG2.selectAll('rect#pts-din')
        .style("fill", clasificacion(teamData.rk));

    SVG2.selectAll('rect#rect-gf')
        .style("fill", dif_goals(teamData.gd));

    let goleador = teamData.top_team_scorer.split('-')[0].split(',')[0].trim();
    let goles_goleador = teamData.top_team_scorer.split('-')[1];

    // Seleccionamos data del goleador
    let data_filtrada_goleador = data_filtrada.filter(d => esMismaPersona(d.name,goleador));

    if (data_filtrada_goleador.length === 1) {
        SVG2.selectAll("image#goleador-foto")
            .attr("xlink:href", data_filtrada_goleador[0].foto)
    }
    else{
        SVG2.selectAll("image#goleador-foto")
            .attr("xlink:href", PL_Logo)
    }

    SVG2.selectAll("text#top_scorer")
        .text(`Goleador: ${goleador} - (${goles_goleador} goles)`);

    


    
    

        


}

// !!
// Aclaración colores clasificación

    


