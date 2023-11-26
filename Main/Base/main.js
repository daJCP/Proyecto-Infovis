const SVG1= d3.select("#vis-1").append("svg"); // MultiLineChart
const SVG2 = d3.select("#vis-2").append("svg"); // Circular Packing
const SVG_Selector = d3.select("#vis-selector").append("svg"); // Selector

const PL_Logo = 'https://www.premierleague.com/resources/rebrand/v7.133.4/i/elements/pl-main-logo.png'

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
const scala = 0.8;
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
                nationality: item.nationality,
                flag: item.Flag,
                overall: item.Overall,
                potential: item.Potential,
                club: item.Club,
                club_logo: item.ClubLogo,
                real_face: item.RealFace,
            }
            ));

        
            createMultilineChart(data_ev, data_fifa);
            createSelector(data_ev, data_fifa);
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


    console.log(equipos)

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
const scala_2 = 0.8;

const WIDTH_VIS_2 = 800;
const HEIGHT_VIS_2 = 1000;

const WIDTH_VIS_Selector = 1200;
const HEIGHT_VIS_Selector = 100;

const MARGIN_1 = {
    top: 0,
    bottom: 45,
    left: 45,
    right: 48,
  };

SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);
SVG_Selector.attr("width", WIDTH_VIS_Selector).attr("height", HEIGHT_VIS_Selector);

const container1 = SVG1.append("g").attr(
    "transform",
    `translate(${MARGIN.left} ${MARGIN.top + MARGIN.bottom})`
  );

function createSelector(data, data_fifa) {
    
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

    function highlightTeam(selectedTeam) {
        // Reduce la opacidad de todos los equipos
        console.log(selectedTeam);

        // container2 seleccionar todos los path y circle con 0.1 de opacidad

        container2.selectAll('path')
            .attr('opacity', 0.1);
        container2.selectAll('circle')
            .attr('opacity', 0.1);
    
        // Aumenta la opacidad del equipo seleccionado
        container2.selectAll('path')
            .filter(d => d[0].equipo === selectedTeam)
            .attr('opacity', 1);
        container2.selectAll('circle')
            .filter(d => d.equipo.equipo === selectedTeam)
            .attr('opacity', 1);

        SVG1.selectAll("image.extra")
            .attr('opacity', 0.25);
        SVG1.selectAll("image.extra")
            .filter(d => d.equipo.equipo === selectedTeam)
            .attr('opacity', 1);
        
    }

    function resetVisualization() {
        container2.selectAll('path')
            .attr('opacity', 1);
        container2.selectAll('circle')
            .attr('opacity', 1);
        SVG1.selectAll("image.extra")
            .attr('opacity', 1);
    }

    // Selector de equipo
    SVG_Selector.selectAll("image:not(.premier_league)")
    .on('click', (evento, d) => {
        let texto = `Datos ${d.equipo.equipo} `;
        d3.selectAll("#selected").text(texto);
        highlightTeam(d.equipo.equipo);
    });

    SVG_Selector.selectAll("image.premier_league")
        .on('click', () => {
            let texto = `Dato Premier League`;
            d3.selectAll("#selected").text(texto);
            resetVisualization();
        });
    
    const movimiento = -((escalaEquipos(2) - escalaEquipos(1)) * img_scale * 0.5);

    // Hacer más ancha la image al poner mouse encima
    SVG_Selector.selectAll("image:not(.premier_league)")
        .on("mouseover", function() {
            d3.select(this).attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale * 1.5)
            .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale * 1.5);
            d3.select(this).raise();
            // Translate hacia arriba
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
        })
        .on("mouseout", function() {
            d3.select(this).attr("width", (escalaEquipos(2) - escalaEquipos(1)) * img_scale)
            .attr("height", (escalaEquipos(2) - escalaEquipos(1)) * img_scale);
        });

    
        
}













// <>>>>>><<<<<<<>>>>< Visualización 3 ><---------------------------------------------------------------><>>>>>><<<<<<<>>>><


function crearSistemaSolar() {
    /* 
    Esta función utiliza el dataset indicado en PLANETAS para crear el
    sistema solar.
    En esta están todos los planetas, pero no está el sol. Este último
    debe ser dibujado manualmente. El resto se debe dibujar aplicando datajoin 
    */
    d3.json(PLANETAS).then(d => {

        let data_planetas = d.map(item => ({
            planet: item.planet,
            diameter: +item.diameter,
            distance_from_sun: +item.distance_from_sun,
            mean_temperature: +item.mean_temperature,
        }
        ));

        plot_planetas(data_planetas);
    })

    /* 
    Cada vez que se haga click en un planeta. Debes llamar a
    preprocesarSatelites(categoria, false) donde "categoria" 
    el valor indicado en la constante CATEGORIAS_POR_PLANETA
    según el planeta seleccionado.
    Esta función se encargará de llamar a crearSatelites(...)
    */
}

function plot_planetas(data_planetas) {

    // Creamos escala distancias planetas con el sol
    let sunDiameter = WIDTH_VIS_1*0.3;
    let minDist = d3.min(data_planetas, d => d.distance_from_sun);
    let maxDist = d3.max(data_planetas, d => d.distance_from_sun);
    let escalaDist = d3.scaleLog().domain([minDist, maxDist]).range([minDist/sunDiameter * WIDTH_VIS_1, WIDTH_VIS_1*0.97]);
    
    
    // Creamos escala de colores en base a temperaturas
    let minTemp = d3.min(data_planetas, d => d.mean_temperature);
    let maxTemp = d3.max(data_planetas, d => d.mean_temperature);
    let escalaColores = d3.scaleDiverging(t => d3.interpolateRdBu(1 - t))
    .domain([minTemp, 0, maxTemp])

    // Creamos escala diametros
    let minDiameter = d3.min(data_planetas, d => d.diameter);
    let maxDiameter = d3.max(data_planetas, d => d.diameter);
    
    let escalaDiametro = d3.scaleLinear([minDiameter, maxDiameter], [sunDiameter*0.05, sunDiameter*0.4]);
    

    // Agregamos los planetas
    let planetasG = SVG1.append('g').attr('id', 'planetasG');
    
    console.log(data_planetas);
    console.log(maxDist);

    const font_size = 10;

    // Agregamos las elipses
    planetasG.selectAll('ellipse')
        .data(data_planetas)
        .join('ellipse')
        .attr('cx', 0)
        .attr('cy', HEIGHT_VIS_1/2)
        .attr('rx', d => escalaDist(d.distance_from_sun))
        .attr('ry', d => sunDiameter/2 + escalaDist(d.distance_from_sun)*0.13)
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-width', 1)
    
    

    // Agregamos los planetas

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "grey")  
        .style("border", "1px solid black")  
        .style("padding", "5px")
        .style("color", "black");

    planetasG
        .selectAll("circle")
        .data(data_planetas)
        .join('circle')
        .attr('distancia', d => CATEGORIAS_POR_PLANETA[d.planet])
        .attr("cx", d => escalaDist(d.distance_from_sun))
        .attr("cy", HEIGHT_VIS_1/2)
        .attr("r", d => escalaDiametro(d.diameter)/2)
        .attr('fill', d => escalaColores(d.mean_temperature))
        .on("click", (evento, data_planetas) => {
            // Generamos los satelites
            preprocesarSatelites(CATEGORIAS_POR_PLANETA[data_planetas.planet], false);
        })
        .on("mouseover", function(evento, d) {
            // Mostrar tooltip
            tooltip.style("left", (evento.pageX + 10) + "px")
                   .style("top", (evento.pageY - 10) + "px")
                   .style("visibility", "visible")
                   .html("Distancia al sol: " + d.distance_from_sun + "<br>" +
                         "Diámetro: " + d.diameter + "<br>" +
                         "Temperatura media: " + d.mean_temperature + "<br>" +
                         "Nombre: " + d.planet +"<br>");
        })
        .on("mousemove", function(evento, d) {
            // La posición del tooltip sigue al mouse
            tooltip.style("left", (evento.pageX + 10) + "px")
                   .style("top", (evento.pageY - 10) + "px")
                   .html("Distancia al sol: " + d.distance_from_sun + "<br>" +
                         "Diámetro: " + d.diameter + "<br>" +
                         "Temperatura media: " + d.mean_temperature + "<br>" +
                         "Nombre: " + d.planet +"<br>");
        })
        .on("mouseout", function() {
            // Ocultar tooltip
            tooltip.style("visibility", "hidden");
        });
    
    // Agregamos el nombre de los planetas
    planetasG
        .selectAll('text')
        .data(data_planetas)
        .join('text')
        .attr('x', d => escalaDist(d.distance_from_sun))
        .attr('y', d => HEIGHT_VIS_1/2 + escalaDiametro(d.diameter)*0.6 + font_size)
        .attr('font-size', font_size)
        .attr('font-family', 'monospace')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.planet);

    // Agregamos el sol
    planetasG
        .append('circle')
        .attr('cx', 0)
        .attr('cy', HEIGHT_VIS_1/2)
        .attr('r', sunDiameter/2)
        .attr('fill', '#ff5100');
    
    
}


function crearSatelites(dataset, categoria, filtrar_dataset, ordenar_dataset) {
    // 1. Actualizo nombre de un H4 para saber qué hacer con el dataset

    // 2. Nos quedamos con los satelites asociados a la categoría seleccionada
    console.log(categoria)
    let datos = dataset.filter(d => CATEGORIAS_POR_PLANETA[d.planet] == categoria)



    // 3. Filtrar, cuando corresponde, por magnitud
    // Completar aquí
    console.log(filtrar_dataset)
    if (filtrar_dataset) {
        datos = datos.filter(d => d.radius > 100);
      }

    // 4. Quedarnos con solo 30 satelites. No editar esta línea
    datos = datos.slice(0, 30);
    console.log(datos)

    // 5. Ordenar, según corresponda, los 30 satelites. Completar aquí
    console.log(ordenar_dataset)
    
    if (ordenar_dataset == 'alfabético') {
        datos.sort((a,b) => a.name.localeCompare(b.name)); // Orden alfabetico
    }
    if (ordenar_dataset == 'albedo') {
        datos.sort((a,b) => a.albedo - b.albedo); // Orden menor a mayor albedo
    }


    // 6. Confeccionar la visualización

    // Generamos el 'select' de los planetas
    // Aplicar estilos a los circle que coinciden con la categoría
    SVG1
        .selectAll('circle')
        .filter(function(d) {
            return d3.select(this).attr('distancia') === categoria;
        })
        .style('stroke', 'white')
        .style('stroke-width', 7);

    // Remover el borde de los circle de la otra categoría
    SVG1
        .selectAll('circle')
        .filter(function(d) {
            return d3.select(this).attr('distancia') !== categoria;
        })
        .style('stroke', 'none');

    joinDeDatos(datos); // Dibujamos los satélites
    joinDeDatos(datos); // Hacemos el update

    


}

function joinDeDatos(datos) {
    const N_FILMS = 6;

    // Creamos escala diametros
    let minCabeza = d3.min(datos, d => d.radius);
    let maxCabeza = d3.max(datos, d => d.radius);
    
    let escalaCabeza = d3.scaleLinear([minCabeza, maxCabeza], [(WIDTH_VIS_2/N_FILMS)*0.05, (WIDTH_VIS_2/N_FILMS)*0.12]);
    
    // Creamos escala color cabeza
    let minCabezaMagnitud = d3.min(datos, d => d.magnitude);
    let maxCabezaMagnitud = d3.max(datos, d => d.magnitude);
    
    let escalaColorCabeza = d3.scaleLinear([minCabezaMagnitud, maxCabezaMagnitud], ['white', 'yellow']);
    
    // Creamos escala distancia brazos
    let minAlbedo = d3.min(datos, d => d.albedo);
    let maxAlbedo = d3.max(datos, d => d.albedo);
    
    let escalaBrazos = d3.scaleLinear([minAlbedo, maxAlbedo], [(WIDTH_VIS_2/N_FILMS)*0.17,(WIDTH_VIS_2/N_FILMS)*0.4]);
    
    let radio_brazos = (WIDTH_VIS_2/N_FILMS)*0.05

    const PLANETS_COLORS = {
        'Mercury': '#8B0000', // Rojo
        'Venus': '#FFD700',   // Dorado
        'Earth': '#0000FF',   // Azul
        'Mars': '#FF4500',    // Naranja
        'Jupiter': '#228B22', // Verde bosque
        'Saturn': '#DAA520',  // Dorado oscuro
        'Uranus': '#00CED1',  // Turquesa
        'Neptune': '#9400D3', // Morado oscuro
        'Pluto': '#A52A2A'    // Café
      };
      
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltipSatelite")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "grey")  
      .style("border", "1px solid black")  
      .style("padding", "5px")
      .style("color", "black");


    SVG2.selectAll("g")
        .data(datos, d => d.name)
        .join(
        enter => {
            const G = enter.append("g");

            // Cuadrilla
            G.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', (WIDTH_VIS_2/N_FILMS))
            .attr('height', (HEIGHT_VIS_2/N_FILMS))
            .attr('fill', 'black')
            .attr('stroke', 'none');

            // Brazos CURVOS *
            G.append('ellipse')
            .attr('cx', (WIDTH_VIS_2/N_FILMS)/2)
            .attr('cy', (HEIGHT_VIS_2/N_FILMS)/2)
            .attr('rx', d => escalaBrazos(d.albedo))
            .attr('ry', 15)
            .attr('fill', 'none')
            .attr('stroke', d => PLANETS_COLORS[d.planet])
            .attr('stroke-width', radio_brazos *0.4);

            // Tapamos parte superior
            G.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', (WIDTH_VIS_2/N_FILMS))
            .attr('height', (HEIGHT_VIS_2/N_FILMS)/2)
            .attr('fill', 'black');


            // Cuerpo
            G.append('rect')
            .attr('x', (WIDTH_VIS_2/N_FILMS)/2 - ((WIDTH_VIS_2/N_FILMS)/2 * 0.1)/2)
            .attr('y', (HEIGHT_VIS_2/N_FILMS)/2)
            .attr('width', (WIDTH_VIS_2/N_FILMS)/2 * 0.1)
            .attr('height', (HEIGHT_VIS_2/N_FILMS)/2 * 0.8)
            .attr('fill',  d => PLANETS_COLORS[d.planet]);

            // Mano derecha
            G.append("circle")
            .attr("cx", d => escalaBrazos(d.albedo) + (WIDTH_VIS_2/N_FILMS)/2 )
            .attr("cy", (HEIGHT_VIS_2/N_FILMS)/2)
            .attr("fill",  d => PLANETS_COLORS[d.planet])
            .attr("r",   radio_brazos);
            // Mano izquierda
            G.append("circle")
            .attr("cx", d =>  (WIDTH_VIS_2/N_FILMS)/2 - escalaBrazos(d.albedo))
            .attr("cy", (HEIGHT_VIS_2/N_FILMS)/2)
            .attr("fill",  d => PLANETS_COLORS[d.planet])
            .attr("r",  radio_brazos);

            // -------------------------

            // Cabeza
            G.append("circle")
            .attr("cx", (WIDTH_VIS_2/N_FILMS)/2 )
            .attr("cy", (HEIGHT_VIS_2/N_FILMS)/2)
            .attr("fill", d => escalaColorCabeza(d.magnitude))
            .attr("r",  d => escalaCabeza(d.radius));

            // Texto
            G.append("text")
            .attr("x", (WIDTH_VIS_2/N_FILMS)/2)
            .attr("y", (HEIGHT_VIS_2/N_FILMS)/2 * 0.5)
            .attr("text-anchor", "middle")
            .attr('font-family', 'monospace')
            .attr('fill',  d => PLANETS_COLORS[d.planet])
            .text(d => d.name);

            G.attr("transform", (d, i) => {
                const x = -(WIDTH_VIS_2/N_FILMS);
                const y = -(HEIGHT_VIS_2/N_FILMS);
                return `translate(${x}, ${y})`;
                })
          },
          update => {
            // update es cada G.
            update.select("circle")
              .transition("nueva_posicion")
              .duration(1000);
            update.select("text").text(d => d.name);

            update.transition("nueva_posicion")
                .duration(1000)
                .attr("transform", (d, i) => {
                const n = Math.floor(WIDTH_VIS_2 / (WIDTH_VIS_2 / N_FILMS));
                const x = (i % n) * (WIDTH_VIS_2 / N_FILMS);
                const y = Math.floor(i / n) * (HEIGHT_VIS_2 / N_FILMS);
                return `translate(${x}, ${y})`;
                })

            return update
          },
          exit => {
            exit.transition()
                .duration(1500)
                .attr('transform', (d,i) => {
                    const x =  (WIDTH_VIS_2 / 2);
                    const y =  (HEIGHT_VIS_2) * 1.4;
                    return `translate(${x}, ${y})`;
                })
                .remove();
          }
        )

    
    SVG2.selectAll('g')
        .on("mouseover", function(evento, d) {
            // Mouse sobre satelite, cambiamos opacidad.
            SVG2.selectAll('g')
                .filter(function(e) {
                    return e !== d;
                })
                .style('opacity', 0.4); // Bajamos la opacidad de los elementos filtrados
            
            // Mostrar tooltip
            tooltip.style("left", (evento.pageX + 10) + "px")
                .style("top", (evento.pageY - 10) + "px")
                .style("visibility", "visible")
                .html("Nombre: " + d.name + "<br>" +
                        "Planeta: " + d.planet + "<br>" +
                        "Magnitud: " + d.magnitude + "<br>" +
                        "Albedo: " + d.albedo +"<br>" +
                        "Radio: " + d.radius +"<br>");
        })
        .on("mousemove", function(evento, d) {
            // La posición del tooltip sigue al mouse
            tooltip.style("left", (evento.pageX + 10) + "px")
                .style("top", (evento.pageY - 10) + "px")
                .html("Nombre: " + d.name + "<br>" +
                        "Planeta: " + d.planet + "<br>" +
                        "Magnitud: " + d.magnitude + "<br>" +
                        "Albedo: " + d.albedo +"<br>" +
                        "Radio: " + d.radius +"<br>");
        })
        .on("mouseout", function() {
            // Restauramos la opacidad de todos los elementos del g
            SVG2.selectAll('g')
                .style("opacity", 1);
            tooltip.style("visibility", "hidden");
        });
    
    
    
}


