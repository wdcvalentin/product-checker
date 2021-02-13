import axios from 'axios';
import cheerio from 'cheerio';

const AxiosInstance = axios.create();
const productIds = {
  id_1: 'PB00385045',
  id_2: 'PB00254175',
  // id_3: 'PB99993070'
}
const getData = async (url: string) => {
  const response = await AxiosInstance.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  if (!$('.title > h1').text()) {
    return {
      productName : null,
      availability : null,
      price : null,
    }
  } else {
    const productName = $('.title > h1').text();
    const availability = $('.content > div > span').text();
    const price = $('.product-info > .wrap-aside > aside > .price >.price').text();
    return {
      productName,
      availability,
      price
    }
  }
}
for (let id in productIds) {
  const url = `https://www.ldlc.com/fiche/${productIds[id]}.html`;
  getData(url)
  const logging = async (url: string) => {
    const { productName, availability, price } = await getData(url);
    console.log('price', price)
    console.log('productName', productName)
    console.log('availability : ', availability !== 'Rupture' ? true : false);
    console.log('------------------------------------------------------------')
  }
  setInterval(() => {
    logging(url);
  }, 3000);
}
