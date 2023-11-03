#!/usr/bin/env node
const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');

const System = {
  out: {
    printLn: function (content) {
      console.log(content);
    }
  }
}

const Dolar = {
  mostrarCambio: function ({ title, content}) {
    System.out.printLn(title.text()); // dolar type title
    let [buy, sell] = content.text().split("Venta") // dolar value ex. Compra$XXX.XXVenta$XXX.XX
    buy = buy.split("Compra")[0];
    System.out.printLn(`${!!buy && chalk.bgRed.underline(`Compra ${buy}`) + ' | '} ${chalk.bgGreen.underline(`Venta ${sell}`)}`)
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
      Dolar.mostrarCambio({ title: $(info[0]), content: $(info[1]) });
      // for (let j = 0; j < info.length; j++) {
      // }
      System.out.printLn("=========");
    }
  } catch (error) {
    System.out.printLn('Error al hacer la solicitud HTTP:' + error);
  }
}

main();