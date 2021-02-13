import axios from 'axios';
import cheerio from 'cheerio';

const AxiosInstance = axios.create();
const productIds = [
  'PB00385045',
  'PB00254175',
  // 👇👇 is an error test
  // 'PB99993070'
]

const logging = async (url: string, id: string) => {
  const { productName, availability, price } = await getData(url, id);
  console.log('price', price);
  console.log('productName', productName);
  console.log('availability : ', availability !== 'Rupture' ? true : false);
  console.log('------------------------------------------------------------');
};

const getData = async (url: string, id: string) => {
  try {
    const response = await AxiosInstance.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    if (!$('.title > h1').text()) {
      return {
        productName: null,
        availability: null,
        price: null,
      }
    }
    const productName = $('.title > h1').text();
    const availability = $('.content > div > span').text();
    const price = $('.product-info > .wrap-aside > aside > .price >.price').text();
    return {
      productName,
      availability,
      price
    }
  } catch (error) {
    productIds.filter(p_id => p_id !== id);
    productIds.some(_id => _id === id)
    console.log(`${url} is down`);
  };
};

productIds.map(id => {
  const url: string = `https://www.ldlc.com/fiche/${id}.html`;
  getData(url, id);
  // logging(url);

  setInterval(() => {
    logging(url, id);
  }, 3000);
})
