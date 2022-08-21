const { default: axios } = require('axios');
const cheerio = require('cheerio');

module.exports = async query => {
  const modifiedQuery = `${query} meme`;

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
    'Content-Type': 'image/png',
  };

  const params = {
    q: modifiedQuery, // search query
    tbm: 'isch', // image results
    hl: 'en', // language of the search
    gl: 'in', // country where search comes from
    ijn: 0, // page number
  };

  const { data } = await axios.get('https://www.google.com/search', {
    params: params,
    headers: headers,
  });

  const $ = cheerio.load(data);

  const images = [];

  $('div[class="isv-r PNCib MSM1fd BUooTd"]')
    .find('div > a > div > img')
    .each((index, image) => {
      const imageURL = $(image).attr('data-src');

      if (imageURL) {
        images.push({
          type: 'photo',
          id: index,
          title: $(image).attr('alt'),
          photo_url: imageURL,
          thumb_url: imageURL,
        });
      }
    });

  return images;
};
