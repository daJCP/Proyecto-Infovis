const SVG1= d3.select("#vis-1").append("svg"); // MultiLineChart
const SVG2 = d3.select("#vis-2").append("svg"); // Circular Packing

const EV_PL = 'data\data_Procesada\proyecto_data_ev_table_premier_league_2022_2023.csv';
const FIFA = 'data\data_Procesada\proyecto_data_fifa.csv';
const data = 'data/data_Procesada/proyecto_data_ev_table_premier_league_2022_2023.json'

// const data = [
//     {
//       equipo: "Equipo A",
//       puntuaciones: [1, 2, 4, 8, 9, 4, 8]
//     },
//     {
//       equipo: "Equipo B",
//       puntuaciones: [7, 6, 7, 8, 4, 2, 9]
//     },
//     {
//       equipo: "Equipo C",
//       puntuaciones: [1, 8, 1, 7, 1, 9,3]
//     }
//   ];
  

// Tamaños
const WIDTH_VIS_1 = 900;
const HEIGHT_VIS_1 = 600;

const WIDTH_VIS_2 = 800;
const HEIGHT_VIS_2 = 800;

const MARGIN = {
    top: 70,
    bottom: 70,
    left: 15,
    right: 100,
  };



SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);
SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);

const container2 = SVG1.append("g").attr(
    "transform",
    `translate(${MARGIN.left} ${MARGIN.top})`
  );

loadingData();

function loadingData() {

    d3.json(data).then(d => {
        console.log(d)

        let data_ev = d.map(item => ({
            equipo: "Equipo B",
            puntuaciones: [7, 6, 7, 8, 4, 2, 9]
        }
        ));

        
    //     createMultilineChart(data_ev);
    })
}



function createMultilineChart(data) {
    
    // Grafico MultilineChart de la data data en SVG1


    // Creamos escalas
    const n = data[0].puntuaciones.length // Total de partidos
    console.log(n)

    const minPunt = d3.min(data, d => d3.min(d.puntuaciones));
    const maxPunt = d3.max(data, d => d3.max(d.puntuaciones));

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const escalaX = d3.scaleLinear([1, n], [1, WIDTH_VIS_1 - MARGIN.left - MARGIN.right]);
    const escalaY = d3.scaleLinear([1, 9], [1, HEIGHT_VIS_1 - 2 * MARGIN.bottom]);

    // Creamos ejes
    const ejeX = d3.axisBottom(escalaX).ticks(n);
    const ejeY = d3.axisLeft(escalaY).ticks(8);



    // Agregamos ejes
    SVG1.append('g')
        .attr("transform",`translate(${MARGIN.left}, ${MARGIN.top + HEIGHT_VIS_1 - 2 * MARGIN.bottom})`)
        .call(ejeX)
        .selectAll("line")
        .attr("y1", -(HEIGHT_VIS_1 - 2 * MARGIN.bottom))
        .attr("stroke-dasharray", "5")
        .attr("opacity", 0.4);
        
    SVG1.append('g')
        .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
        .call(ejeY)
        .selectAll("line")
        .attr("x1", WIDTH_VIS_1 - 2 * MARGIN.left)
        .attr("stroke-dasharray", "5")
        .attr("opacity", 0.4);
        

    // Creamos lineas y puntos
    const flattenedData = data.flatMap((equipo, equipoIndex) => 
    equipo.puntuaciones.map((puntuacion, index) => ({
        equipo,
        puntuacion,
        index: index + 1,
    }))
    );

    container2.raise();

    container2.selectAll("circle")
        .data(flattenedData)
        .join("circle")
        .attr("r", 6)
        .attr("fill",  (d) => colorScale(d.equipo))
        .attr("cx", (d) => escalaX(d.index))
        .attr("cy", (d) => escalaY(d.puntuacion));
    
    const equipos = d3.group(flattenedData, d => d.equipo);

    var lines = d3.line()
    .x(d => escalaX(d.index)) 
    .y(d => escalaY(d.puntuacion));


    console.log(equipos)

    container2.selectAll('path')
        .data(equipos)
        .join('path')
        .attr('d', ([d, val]) => lines(val)) 
        .attr('fill', 'none')
        .attr('stroke', ([key]) => colorScale(key))
        .attr('stroke-width', 4);
    
    // Logo club

    const extraPoints = data.map(equipo => ({
        equipo,
        puntuacion: equipo.puntuaciones[ n - 1], // misma puntuación que el último punto
        index: n // posición x para el nuevo punto
    }));

    
    // Dibujar el círculo extra para cada serie
    container2.selectAll("circle.extra")
        .data(extraPoints)
        .join("circle")
        .attr("class", "extra")
        .attr("r", 20)
        .attr("fill", d => colorScale(d.equipo))
        .attr("cx", d => escalaX(d.index))
        .attr("transform", `translate(${(escalaX(1)- escalaX(0))/3 }, 0)`)
        .attr("cy", d => escalaY(d.puntuacion));
}



// crearSistemaSolar();

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
    let texto = `Categoria: ${categoria} - Filtrar: ${filtrar_dataset} - Orden: ${ordenar_dataset}`
    d3.selectAll("#selected").text(texto)

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


