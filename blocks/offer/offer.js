/* eslint-disable no-underscore-dangle */
export default async function decorate(block) {
  const aempublishurl = 'https://publish-p51327-e1446332.adobeaemcloud.com';
  const aemauthorurl = 'https://author-p51327-e1446332.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/wknd-shared/offer-by-path';
  const offerpath = block.querySelector(':scope div:nth-child(1) > div a').innerHTML.trim();
  const variationname = "master";//block.querySelector(':scope div:nth-child(2) > div > p').innerText ? block.querySelector(':scope div:nth-child(2) > div > p').innerText : 'main';
  //const variationname = block.querySelector(':scope div:nth-child(2) > div').innerHTML.trim();

  const url = window.location && window.location.origin && window.location.origin.includes('author')
    ? `${aemauthorurl}${persistedquery};cfpath=${offerpath}`
    : `${aempublishurl}${persistedquery};cfpath=${offerpath}`;
  const options = { credentials: 'include' };

  // console.log(url); //https://author-p123917-e1220159.adobeaemcloud.com/graphql/execute.json/securbank/OfferByPath;path=/content/dam/securbank/en/offers/997;variation=main;ts=172.03956935404463

  const cfReq = await fetch(offerpath+".-1.json", options)
    .then((response) => response.json())
    .then((contentfragment) => {
      let offer = {};
      const masterData = contentfragment['jcr:content'].data.master;
      if (masterData) {
        offer.title = masterData.title;
        offer.subtitle = masterData.subtitle;
        offer.bannerimage = masterData.bannerimage.replace(/ /g, '%20');
        offer.description = masterData.description;
        offer.ctalabel = masterData.ctalabel;
        offer.ctaurl = masterData.ctaurl;
      }/*else{
        const masterData = contentfragment['jcr:content'].data.master;        
        offer.title = masterData.title;
        offer.subtitle = masterData.subtitle;
        offer.bannerimage =  masterData.bannerimage.replace(/ /g, '%20');
        offer.description = masterData.description;
        offer.ctalabel = masterData.ctalabel;
        offer.ctaurl = masterData.ctaurl;
      }*/
      return offer;
    });

 // const itemId = `urn:aemconnection:${offerpath}/jcr:content/data/${variationname}`;

  block.innerHTML = `
  <div class='banner-content' data-aue-type="reference" data-aue-filter="cf">
      <div data-aue-prop="heroImage" data-aue-type="media" class='banner-detail' style="background-image: linear-gradient(90deg,rgba(0,0,0,0.6), rgba(0,0,0,0.1) 80%) ,url(${cfReq.bannerimage});">
          <p data-aue-prop="title" data-aue-type="text" class='headline'>${cfReq.title}</p>
          <p data-aue-prop="subtitle" data-aue-type="text" class='pretitle'>${cfReq.subtitle}</p>
          <p data-aue-prop="detail" data-aue-type="richtext" class='detail'>${cfReq.description}</p>
          <p class="button-container"><a data-aue-prop="ctaUrl" data-aue-type="text" href="${cfReq.ctaurl}" title="${cfReq.ctalabel}" class="button">${cfReq.ctalabel}</a></p>
      </div>
  </div>
`;
}
