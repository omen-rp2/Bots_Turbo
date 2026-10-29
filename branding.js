export const BRAND_NAME = 'OMEN';
export const WEBSITE_URL = 'https://omen-rp2.github.io/Omen_Web';
export const OWNER_IDS = Object.freeze(['1445069224899907709', '1317806970891272232', '1473659406649528425']);
export const isOwnerId = id => OWNER_IDS.includes(String(id || ''));
export function resolveFrontendUrl(value) {
 const current = String(value || WEBSITE_URL).trim().replace(/\/+$/, '');
 return /^https:\/\/(?:kivenemad538-collab|nexus-rp538)\.github\.io\/(?:legend_Website|Nexus_Website)$/i.test(current) ? WEBSITE_URL : current;
}

export const BUILD_ID = 'NEXUS-GEMINI-EXPERIENCE-V6';
export const SUPPORT_AUDIO_FILE = 'nexus-support-city-v3.ogg';
export const BRAND_COLOR = 0xff792f;
export function brandText(value){return String(value).replace(/legend|nexus/gi,'OMEN').replace(/ليجند|نكسس/g,'أومن').replaceAll('💙','❤️');}
export function brandPayload(payload,frontendUrl=WEBSITE_URL){
 if(typeof payload==='string')return {content:brandText(payload)};
 const result={...payload};
 if(result.content)result.content=brandText(result.content);
 if(result.localized)result.localized=Object.fromEntries(Object.entries(result.localized).map(([lang,item])=>[lang,brandPayload(item,frontendUrl)]));
 if(result.embeds)result.embeds=result.embeds.map(item=>{
  const data=structuredClone(item.toJSON?item.toJSON():item);
  data.color=BRAND_COLOR;
  for(const key of ['title','description'])if(data[key])data[key]=brandText(data[key]);
  data.author={...(data.author||{}),name:brandText(data.author?.name||'NEXUS ROLEPLAY'),icon_url:WEBSITE_URL+'/assets/omen-logo.webp'};
  data.footer={...(data.footer||{}),text:brandText(data.footer?.text||'NEXUS ROLEPLAY • مدينتنا، حكايتك')};
  if(data.fields)data.fields=data.fields.map(field=>({...field,name:brandText(field.name),value:brandText(field.value)}));
  if(!data.image||/legend[-_](?:preview|logo|mark)/i.test(data.image.url||''))data.image={url:WEBSITE_URL+'/assets/omen-banner-v1.jpg'};
  data.thumbnail={url:WEBSITE_URL+'/assets/omen-logo.webp'};
  return data;
 });
 return result;
}
