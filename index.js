#!/usr/bin/env node
const axios = require('axios');
const cheerio = require('cheerio');

const System = {
  out: {
    printLn: function (content) {
      console.log(content);
    }
  }
}

const Dolar = {
  mostrarCambio: function (info) {
    if (info.text().includes("Venta"))
      System.out.printLn(info.text().split('Venta').join(' Venta'));
    else
      System.out.printLn(info.text());
  }
}

async function main() {
  try {
    const response = await axios.get('https://dolarhoy.com/');
    const html = response.data;

    // Cargar el HTML en Cheerio para facilitar su manipulación.
    const $ = cheerio.load(html);

    const bloqueDolares = $('.tile.dolar').children('.is-vertical').children().toArray()

    System.out.printLn("=========");

    for (let i = 0; i < bloqueDolares.length - 1; i++) {
      let dolar = bloqueDolares[i]
      let info = $(dolar).children().toArray();
      for (let j = 0; j < info.length; j++) {
        Dolar.mostrarCambio($(info[j]))
      }
      System.out.printLn("=========");
    }
  } catch (error) {
    System.out.printLn('Error al hacer la solicitud HTTP:'+ error);
  }
}

main();