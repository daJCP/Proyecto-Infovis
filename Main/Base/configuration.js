////////////////////////////
// NO EDITAR ESTE ARCHIVO //
////////////////////////////
const satelitesURL = "https://gist.githubusercontent.com/Hernan4444/c3c1951d161fec6eea6cc70c9b06b597/raw/de6ecf7f0d217e2c7f093b307c506c5708d01764/satelites.json"


/* Cada vez que se seleccione un tipo de planeta, esta función será llamada
para actualizar la segunda visualización */
let SATELITES = [];
function preprocesarSatelites(categoria, filtrar_dataset) {
    // Si la lista de datos está vacía, descargo el dataset
    // y lo guardo en mi variable externa "SATELITES".
    if (SATELITES.length == 0) {
        d3.json(satelitesURL).then(dataset => {
            // Como no pongo let antes, sobrescribo la variable anterior.
            SATELITES = dataset;
            // Llamo de nuevo a preprocesarSatelites 
            // para que ahora si se ejecute cuando SATELITES tenga datos
            preprocesarSatelites(categoria, filtrar_dataset)
        })
        // Hacemos return para que la función no continue su ejecución
        return 0;
    }

    // Generamos una copia del dataset
    let data = JSON.parse(JSON.stringify(SATELITES));

    // Cada vez que se oprime filtrar, se llama nuevamente
    // a preprocesarSatelites con filtro=true
    d3.select("#filter-button").on("click", (event) => {
        preprocesarSatelites(categoria, true);
    })

    // Cada vez que se oprime Restaurar filtro, se llama nuevamente
    // a preprocesarSatelites con filtro=false
    d3.select("#filter-reset").on("click", (event) => {
        preprocesarSatelites(categoria, false);
    })


    // Cada vez que cambia el selector de orden, se llama nuevamente
    // a crearSatelites para que actualice la visualización
    d3.select("#order-by").on("change", (_) => {
        let ordenar_dataset = document.getElementById("order-by").selectedOptions[0].value;
        crearSatelites(data, categoria, filtrar_dataset, ordenar_dataset);
    })

    // Llamamos a la segunda función encargada de crear los datos
    let ordenar_dataset = document.getElementById("order-by").selectedOptions[0].value;
    crearSatelites(data, categoria, filtrar_dataset, ordenar_dataset);
}


// ↓↓ ----------------------------------- Bonus rotación -------------------- ↓↓

const calcularPosicionBonusRotacion = function (i, rx, ry, cx, cy) {
    let anguloInicial = (2 * Math.PI) / 10;
    if (i % 2 != 0) {
        anguloInicial = -(2 * Math.PI) / 10;
    }

    let x = rx * Math.cos(anguloInicial) + cx
    let y = ry * Math.sin(anguloInicial) + cy

    return [x, y]
}

// ↑↑ ----------------------------------- Bonus rotación -------------------- ↑↑

d3.select("#showCat1").on("click", () => preprocesarSatelites("DemoranMucho", false));
d3.select("#showCat2").on("click", () => preprocesarSatelites("DemoranPoco", false));

