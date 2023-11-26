const SVG1= d3.select("#vis-1").append("svg"); // MultiLineChart
const SVG2 = d3.select("#vis-2").append("svg"); // Circular Packing
const SVG_Selector = d3.select("#vis-selector").append("svg"); // Selector

const PL_Logo = 'https://www.premierleague.com/resources/rebrand/v7.133.4/i/elements/pl-main-logo.png'

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

SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);

const container2 = SVG1.append("g").attr(
    "transform",
    `translate(${MARGIN.left} ${MARGIN.top + MARGIN.bottom})`
  );

function extraerYLimpiarApellido(nombre) {
    let nombreSinNumeros = nombre.replace(/[0-9]/g, '');
    let partes = nombreSinNumeros.split(' ');
    return partes[partes.length - 1].toLowerCase();
}

function esMismaPersona(nombre1, nombre2) {        

    let apellido1 = extraerYLimpiarApellido(nombre1);
    let apellido2 = extraerYLimpiarApellido(nombre2);

    let inicial1 = nombre1[0].toLowerCase();
    let inicial2 = nombre2[0].toLowerCase();

    return apellido1 === apellido2 && inicial1 === inicial2 ;
}

function revisamosEdad(edad_fifa, edad_seleccionado) {
    edad_fifa = parseInt(edad_fifa);
    edad_seleccionado = parseInt(edad_seleccionado);

    return edad_fifa - 1 === edad_seleccionado || edad_fifa + 1 === edad_seleccionado || edad_seleccionado === edad_fifa;
}

loadingData();

function loadingData() {

    d3.json(data).then(d => {

        let data_ev = d.map(item => ({
            equipo: item.equipo,
            puntuaciones: item.puntuaciones,
        }
        ));
    
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

                    const extraPoints = data_ev.map(equipo => ({
                        equipo
                    }));


                    

                    // const preprocesadosPLPlayers = data_pl_2023_players.map(seleccionado => ({
                    //     player: seleccionado.player,
                    //     edadValida: data_fifa.some(fifa_player => revisamosEdad(fifa_player.age, seleccionado.age))
                    // })).filter(seleccionado => seleccionado.edadValida);

                    // const data_filtrada = data_fifa.filter(fifa_player =>
                    //     preprocesadosPLPlayers.find(seleccionado =>
                    //         esMismaPersona(fifa_player.name, seleccionado.player)
                    //     )
                    // );


                    let data_filtrada = data_fifa.filter(fifa_player => 
                        data_pl_2023_players.some(seleccionado =>
                            esMismaPersona(fifa_player.name, seleccionado.player) && revisamosEdad(fifa_player.age, seleccionado.age)
                        )
                    );

                    // let data_filtrada = data_fifa;

                    createMultilineChart(data_ev, data_filtrada);
                    createSelector(data_ev, data_filtrada, data_pl_2023_players, data_pl_2023_stats);
                    
                    
                })
            })
        })
    })
}



function createMultilineChart(data, data_fifa) {
    
    const n = data[0].puntuaciones.length ;// Total de partidos
    const n_teams = data.length;
    console.log(n_teams,'Total Equipos');
    console.log(n-1,'Total Fechas por equipo');
    // Grafico MultilineChart de la data data en SVG1
    const flattenedData = data.flatMap((equipo, equipoIndex) => 
    equipo.puntuaciones.map((puntuacion, index) => ({
        equipo,
        puntuacion,
        index: index ,
    }))
    );

    const equipos = d3.group(flattenedData, d => d.equipo);


    const extraPoints = data.map(equipo => ({
        equipo,
        puntuacion: equipo.puntuaciones[ n - 1],
        index: n 
    }));

    



    // Creamos escalas

    const minPunt = d3.min(data, d => d3.min(d.puntuaciones));
    const maxPunt = d3.max(data, d => d3.max(d.puntuaciones));
    console.log(minPunt, maxPunt);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const escalaX = d3.scaleLinear([0, n-1], [0, WIDTH_VIS_1 - MARGIN.left - MARGIN.right]);
    const escalaY = d3.scaleLinear([1, n_teams + 1], [0, HEIGHT_VIS_1 - 2 * MARGIN.bottom]);

    // Creamos ejes
    const ejeX = d3.axisBottom(escalaX).ticks(n);
    const ejeY = d3.axisLeft(escalaY).ticks(n_teams).tickFormat(d => d < 21 ? d : '');

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
    
    // // Sección WestHam United

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

    // Agregamos ejes
    SVG1.append('g')
        .attr("class", "x-axis")
        .attr("transform",`translate(${MARGIN.left}, ${MARGIN.top + HEIGHT_VIS_1 - MARGIN.bottom})`)
        .call(ejeX)
        .selectAll("line")
        .attr("y1", -(HEIGHT_VIS_1 - MARGIN.bottom - MARGIN.top - MARGIN.bottom))
        .attr("stroke-dasharray", "5")
        .attr("opacity", 0.4);
        
    SVG1.append('g')
        .attr("class", "y-axis")
        .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top + MARGIN.bottom})`)
        .call(ejeY)
        .selectAll("line")
        .attr("x1", WIDTH_VIS_1 - MARGIN.left - MARGIN.right)
        .attr("stroke-dasharray", "5")
        .attr("opacity", 0.4);

    // Agregamos Label eje X
    SVG1.append("text")
        .attr("class", "axis-label")
        .attr("x", 0 )
        .attr("y", 0 )
        .attr("transform", `translate(${ WIDTH_VIS_1 / 2}, ${HEIGHT_VIS_1 - MARGIN.bottom + MARGIN.top + 20 * 2})`)
        .style("text-anchor", "middle")
        .text("Jornada de la Liga");

    // Agregamos Label eje Y
    SVG1.append("text")
        .attr("class", "axis-label")
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", `translate(${MARGIN.left - 27}, ${HEIGHT_VIS_1/2}) rotate(-90)`)
        .style("text-anchor", "middle")
        .text("Posición en la Tabla");
    

    // Creamos lineas y puntos
    let lines = d3.line()
        .x(d => escalaX(d.index )) 
        .y(d => escalaY(d.puntuacion));


    // console.log(equipos)

    container2.selectAll('path')
        .data(equipos)
        .join('path')
        .attr('d', ([d, val]) => lines(val)) 
        .attr('fill', 'none')
        .attr('stroke', ([key]) => premier_league_teams[key.equipo])
        .attr('stroke-width', 4);

    container2.raise();

    container2.selectAll("circle")
        .data(flattenedData)
        .join("circle")
        .attr("r", 5)
        .attr("fill",  (d) => premier_league_teams[d.equipo.equipo])
        .attr("cx", (d) => escalaX(d.index ))
        .attr("cy", (d) => escalaY(d.puntuacion));
    
    
    
    // Logo clubes    
    SVG1.selectAll("image.extra")
        .data(extraPoints)
        .join("image")
        .attr("class", "extra")
        .attr("width", escalaY(2) - escalaY(1))  
        .attr("height", escalaY(2) - escalaY(1)) 
        .attr("href", d => data_fifa.filter(a => a.club === d.equipo.equipo)[0].club_logo) 
        .attr("x", d => escalaX(d.index) + MARGIN.left - 20) 
        .attr("y", d => escalaY(d.puntuacion) + MARGIN.top + MARGIN.bottom - (escalaY(2) - escalaY(1))/2); 
      
    
    // ClipPath
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

    const formatTicks = d => Math.ceil(d) === d ? d : "";
    // Función que se llama cuando se hace zoom
    function zoomed(event) {
        // Escala el eje X
        const newXScale = event.transform.rescaleX(escalaX);

        // Actualiza el eje X con el formato personalizado
        SVG1.select(".x-axis")
            .call(d3.axisBottom(newXScale)
            .tickValues(d3.range(0, n, 1).filter(d => newXScale(d) >= 0 && newXScale(d) <= WIDTH_VIS_1)) // Asegura que los ticks sean de a 1
            .tickFormat(formatTicks))
            .selectAll("line")
            .attr("y1", -(HEIGHT_VIS_1 - MARGIN.bottom - MARGIN.top - MARGIN.bottom))
            .attr("stroke-dasharray", "5")
            .attr("opacity", 0.4);

        SVG1.selectAll("image.extra")
            .transition()
            .duration(500)
            .attrTween("y", function(d) {
                const lastVisiblePoint = flattenedData.filter(p => p.equipo.equipo === d.equipo.equipo && newXScale(p.index) <= WIDTH_VIS_1 - MARGIN.right).pop();
                const yStart = d3.select(this).attr("y");
                let yEnd;
            
                if (lastVisiblePoint) {
                    yEnd = escalaY(lastVisiblePoint.puntuacion) + MARGIN.top + MARGIN.bottom - (escalaY(2) - escalaY(1))/2;
                } else {
                    yEnd = yStart;
                }
            
                return  d3.interpolateNumber(yStart, yEnd);
        
            });


        // Actualiza las líneas y puntos para que coincidan con la nueva escala
        lines.x(d => newXScale(d.index));
        container2.selectAll('path').attr('d', ([d, val]) => lines(val));
        container2.selectAll("circle").attr("cx", (d) => newXScale(d.index ));

    }
}


// <>>>>>><<<<<<<>>>>< Visualización 2 ><---------------------------------------------------------------><>>>>>><<<<<<<>>>><

// Tamaños
const WIDTH_VIS_Selector = 1200;
const HEIGHT_VIS_Selector = 100;

SVG_Selector.attr("width", WIDTH_VIS_Selector).attr("height", HEIGHT_VIS_Selector);

function createSelector(data, data_fifa, data_pl_2023_players, data_pl_2023_stats) {

    // Selector de equipo
    const selected = new Set();

    createStats(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, selected);

    
    const n =  data.length;
    const extraPoints = data.map(equipo => ({
        equipo,
        puntuacion: equipo.puntuaciones[ n - 1],
        index: n
    }));

    // Añadimos un cuadrado de background al SVG_Selector

    // Añadir este rec con estilo css
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

    // Creamos un circulo de radio 5 y color rojo por cada equipo en el cuadro

    // lista con n +1 elementos
    // let lista = Array.from(Array(n+1).keys());

    // SVG_Selector.selectAll('circle')
    //     .data(lista)
    //     .join('circle')
    //     .attr('r', 5)
    //     .attr('cx', (d, i) => escalaEquipos(i))
    //     .attr('cy', HEIGHT_VIS_Selector/2)
    //     .attr('fill', 'red');

    // Necesito que
    // Logo clubes 
    const img_scale = 1;

    SVG_Selector.selectAll("image")
        .data(extraPoints)
        .join("image")
        .attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
        .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
        .attr("href", d => data_fifa.filter(a => a.club === d.equipo.equipo)[0].club_logo)
        .attr("x", (d, i) => escalaEquipos(i+1) - ((escalaEquipos(2) - escalaEquipos(1))/2)*img_scale)
        .attr("y", (escalaEquipos(2) - escalaEquipos(1))/2 * img_scale);
        
    // SVG_Selector.selectAll("image")
    //     .attr('transform', `translate(0, ${-((escalaEquipos(2) - escalaEquipos(1)) * img_scale * 0.1)})`);
    
    SVG_Selector.append("image")
        .attr('class', 'premier_league')
        .attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
        .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
        .attr("href", PL_Logo)
        .attr("x",  ((escalaEquipos(2) - escalaEquipos(1)))*0.5*img_scale)
        .attr("y", (escalaEquipos(2) - escalaEquipos(1))/2 * img_scale);

    function highlightTeam(selected) {
        // Aumenta la opacidad del equipo seleccionado
        container2.selectAll('path')
            .attr('opacity',  d => selected.has(d[0].equipo) ? 1 : 0.1);
        container2.selectAll('circle')
            .attr('opacity',  d => selected.has(d.equipo.equipo) ? 1 : 0.1);
        SVG1.selectAll("image.extra")
            .attr('opacity',  d => selected.has(d.equipo.equipo) ? 1 : 0.3);
        
    }

    function resetVisualization(selected) {
        selected.clear();
        container2.selectAll('path')
            .attr('opacity', 1);
        container2.selectAll('circle')
            .attr('opacity', 1);
        SVG1.selectAll("image.extra")
            .attr('opacity', 1);
    }

    SVG_Selector.selectAll("image:not(.premier_league)")
        .on('click', (evento, d) => {
            if (selected.has(d.equipo.equipo)) {
                selected.delete(d.equipo.equipo);
            } else {
                selected.add(d.equipo.equipo);
            }

            createStats(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, selected);

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

    SVG_Selector.selectAll("image.premier_league")
        .on('click', () => {
            let texto = `Dato Premier League`;
            d3.selectAll("#selected").text(texto);
            resetVisualization(selected);
            createStats(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, selected);
        });
    
    const movimiento = -((escalaEquipos(2) - escalaEquipos(1)) * img_scale * 0.5);

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
}

const MARGIN_2 = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

const scala_2 = 0.8;

const WIDTH_VIS_2 = 1250;
const HEIGHT_VIS_2 = 600;

SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);

const SVG2_container = SVG2.append("g").attr(
    "transform",
    `translate(${MARGIN_2.left} ${MARGIN_2.top + MARGIN_2.bottom})`
  );


function createStats(data, data_fifa, data_pl_2023_players, data_pl_2023_stats, selected) {

    let semiWidth = WIDTH_VIS_2 / 2;
    let semiHeight = HEIGHT_VIS_2 / 2;

    // Limpiar elementos existentes
    SVG2.selectAll(".node").remove();

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

    // Cuadrilla izquierda
    SVG2.append('rect')
        .attr("x", MARGIN_2.left*2)
        .attr("y", MARGIN_2.top*2)
        .attr("width", semiWidth - MARGIN_2.left*4)
        .attr("height", HEIGHT_VIS_2-MARGIN_2.bottom*2 - MARGIN_2.top*2)
        .style("stroke", "purple");
    
    let pack = d3.pack()
        .size([semiWidth - MARGIN_2.left*4, HEIGHT_VIS_2-MARGIN_2.bottom*2 - MARGIN_2.top*2])
        .padding(2); 

    // data_pl_2023_players extrae los que tengan de nombre de equipo en selected
    let data_pl_2023_players_selected;
    // console.log(selected, 'Selected');

    if (selected.size === 0) {
        data_pl_2023_players_selected = data_pl_2023_players;
    }
    else{
        // console.log(data_pl_2023_players);
        data_pl_2023_players_selected = data_pl_2023_players.filter(d => selected.has(d.club));
    }

    // Obtenemos la data de fifa filtrada por jugadores
    if (selected.size === 0) {
        data_filtrada = data_fifa;
    }
    else{
        data_filtrada = data_fifa.filter(fifa_player => 
                data_pl_2023_players_selected.some(seleccionado =>
                    esMismaPersona(fifa_player.name, seleccionado.player) && revisamosEdad(fifa_player.age, seleccionado.age)
                )
            );
    }

    // let data_filtrada = data_fifa.filter(fifa_player => 
    //     data_pl_2023_players_selected.some(seleccionado =>
    //         esMismaPersona(fifa_player.name, seleccionado.player) && revisamosEdad(fifa_player.age, seleccionado.age)
    //     )
    // );

    // console.log(data_filtrada, 'data_filtrada');


    // Generar data jerarquizada para el pack layout
    let dataHierarchy = {
        name: "equipos",
        children: Array.from(
          // Agrupar por equipo
          d3.group(data_pl_2023_players_selected, d => d.club), 
          ([name, players]) => ({
            name,
            children: Array.from(
              // Agrupar por nacionalidad dentro de cada equipo
              d3.group(players, d => d.nation),
              ([name, players]) => ({
                name,
                value: players.length // El tamaño del círculo será proporcional al número de jugadores
              })
            )
          })
        )
      };
    
    console.log(dataHierarchy, 'dataHierarchy');


    // Seteamos el root
    var root = d3.hierarchy(dataHierarchy)
      .sum(d => d.value);
    pack(root);

    // Creamos un grupo para cada nodo
    let node = SVG2.selectAll(".node")
        .data(root.descendants());
    
    // Eliminamos los nodos que ya no son necesarios
    node.exit().remove();
    
    // Se crea nuevos nodos para nuevos datos
    let nodeEnter = node.enter().append("g")
        .attr("class", "node");
    
    // Actualizamos todos los nodos existentes y nuevos
    node = nodeEnter.merge(node);
    
    node.attr("transform", d => `translate(${d.x + MARGIN_2.left*2}, ${d.y + MARGIN_2.top*2})`);
    
    node.append("circle")
        .attr("r", d => d.r)
        .style("fill", d => d.depth === 1 ? premier_league_teams[d.data.name] || "black" : "black")
        .style("stroke", "purple");
    
    // Añadir texto
    // node.append("text")
    //     .attr("dy", ".3em")
    //     .style("text-anchor", "middle")
    //     .text(d => d.depth === 2 ? d.data.name : '')  // Solo mostrar texto en nodos hoja
    //     .style("font-size", d => Math.max(10, d.r / 5)) // Ajusta el tamaño del texto en función del radio del círculo, con un mínimo
    //     .style("fill", "white");    
}








// <>>>>>><<<<<<<>>>>< Visualización 3 ><---------------------------------------------------------------><>>>>>><<<<<<<>>>><



    


