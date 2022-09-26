/* Realice una aplicación web que permita listar el contenido (Autor, título y contenido)
del archivo noticias.json.
Este archivo se debe disponer en la carpeta feeds del servidor.
La ruta para listar las noticias debe ser el index (o home) de la aplicación.

El listado de las noticias debe tener un enlace que permita editar el contenido (solo el
atributo de contenido) de la noticia y actualizarlo en el servidor.
El servidor debe levantar en el puerto 8888 */

const fs = require("fs");
const http = require("http");
let form = fs.readFileSync("form.html");
let noticias = JSON.parse(fs.readFileSync("feeds/noticias.json"));

function generarTabla() {
  let tabla = "";
  let id = 1;
  for (let noticia of noticias.news) {
    if (noticia.content != undefined) {
      tabla += `<tr><td><p>${noticia.author}</p></td>
                  <td><p>${noticia.title}</p></td>
                  <td><p>${noticia.content}</p>
                  <td><a href="form-${id}-">Editar</a></tr>`;
      id++;
    } else if (noticia.content == undefined) {
      tabla += `<tr><td><p>${noticia.author}</p></td>
                  <td><p>${noticia.title}</p></td>
                  <td><p>No existe contenido en esta noticia</p>
                  <td><a href="form-${id}-">Editar</a></tr>`;
      id++;
    }
  }

  return tabla;
}

//console.log(data);

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (req.url == "/index") {
    let data = generarTabla();
    res.write(`<table><tr>
      <td>
        <h1>Author</h1>
      </td>
      <td>
        <h1>Title</h1>
      </td>
      <td>
        <h1>Content</h1>
      </td>
    </tr>
      ${data}<table>
      <form method="GET">`);
    res.end();
  } else if (req.url == "/form-1-") {
    res.write(form);
    res.end();
  } else if (req.url == "/form-2-") {
    res.write(form);
    res.end();
  } else if (req.url == "/form-3-") {
    res.write(form);
    res.end();
  } else if (req.url.indexOf("?")) {
    let nuevo_contenido = { content: "algo" };
    let n_id = req.url.split("-");
    let id = n_id[1];
    let url_data = req.url.split("/");

    let content = url_data[1].split("=");
    if (content[1].indexOf("+")) {
      content[1] = content[1].replaceAll("+", " ");
    }
    nuevo_contenido.content = content[1];
    noticias.news[id - 1].content = nuevo_contenido.content;
    fs.writeFileSync("feeds/noticias.json", JSON.stringify(noticias));
    res.end("<h1>Contenido Modificado");
  } else {
    res.statusCode = 404;
    res.end("404 - Not Found");
  }
});

server.listen(8888, () => {
  console.log("Server iniciado");
});
