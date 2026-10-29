export const OMEN_ART={logo:'https://omen-rp2.github.io/Omen_Web/assets/omen-logo.webp',banner:'https://omen-rp2.github.io/Omen_Web/assets/omen-banner-v1.jpg'};
const SITE='https://omen-rp2.github.io/Omen_Web/';
const button=(label,hash)=>({type:2,style:5,label,url:SITE+hash});
const embed=(title,description)=>({author:{name:'OMEN ROLEPLAY',icon_url:OMEN_ART.logo},title,description,color:0xff792f,image:{url:OMEN_ART.banner},footer:{text:'OMEN • حكايتك تبدأ هنا'},timestamp:new Date().toISOString()});
export function omenNotice(kind,{application:a,id,joinedAt}={}){
 let e,components;
 if(kind==='account'){e=embed('حسابك في أومن جاهز 🟠',`أهلًا <@${id}>، ده أول تسجيل ليك في موقع أومن.\nاقرأ القوانين وقدّم على السيرفر، وتابع حالة طلبك من حسابك.`);components=[button('قوانين الرول بلاي','#rules'),button('ابدأ التقديم','#apply')];e.footer={text:'OMEN • حساب الموقع'};}
 if(kind==='welcome'){e=embed('نورت أومن 🟠',`أهلًا <@${id}>، سعيدين إنك بقيت جزء من مدينتنا.\n\nاقرأ القوانين، جهّز شخصيتك، وابدأ حكاية تستاهل تتحكي.`);components=[button('قدّم على السيرفر','#apply'),button('اعرف أومن والقوانين','#about')];}
 if(kind==='pending'){e=embed('استلمنا تقديمك ⏳','طلبك وصل وبقى **قيد المراجعة**.\nمش محتاج مقابلة صوتية. لما يتاخد القرار هتلاقيه على الموقع، وهنبعتلك هنا كمان.');e.fields=[{name:'رقم الطلب',value:`#${a.id}`,inline:true},{name:'الحالة',value:'قيد المراجعة',inline:true}];components=[button('تابع حالة طلبك','#account')];}
 if(kind==='accepted'){e=embed('أهلًا بيك في المدينة ✓','مبروك، **تم قبول تقديمك في أومن**.\nجهّز شخصيتك وراجع القوانين قبل أول دخول. مستنيين حكايتك.');e.fields=[{name:'رقم الطلب',value:`#${a.id}`,inline:true},{name:'الحالة',value:'مقبول',inline:true}];components=[button('دخول السيرفر','#queue'),button('حالة طلبك','#account')];}
 if(kind==='rejected'){e=embed('تحديث بخصوص تقديمك','للأسف، **لم يتم قبول الطلب** المرة دي.\nراجع السبب قبل ما تقدم من جديد.');e.fields=[{name:'رقم الطلب',value:`#${a.id}`,inline:true},{name:'سبب الرفض',value:a.reason||'راجع تفاصيل الطلب على الموقع.'}];components=[button('تفاصيل الطلب','#account')];}
 if(!e)throw Error('Unknown notice');
 return {content:kind==='welcome'?`<@${id}>`:undefined,embeds:[e],components:[{type:1,components}],allowedMentions:{parse:[],users:kind==='welcome'?[id]:[]}};
}
export function reviewEmbed(a){const v=JSON.parse(a.answers||'{}'),status={pending:'قيد المراجعة',accepted:'مقبول',rejected:'مرفوض'}[a.status]||'قيد المراجعة';const e=embed(`تقديم دخول المدينة • #${a.id}`,`**${v.character||'شخصية اللاعب'}**\nصاحب الطلب: <@${a.discord_id}>\nالحالة: **${status}**`);e.fields=[{name:'العمر',value:String(v.age||'—'),inline:true},{name:'الحالة',value:status,inline:true},{name:'الخبرة في الرول بلاي',value:String(v.experience||'غير متاحة في النسخة المسترجعة.').slice(0,1024)},{name:'قصة الشخصية',value:String(v.story||'راجع الملف المرفق.').slice(0,1024)},{name:'التصرف في السيناريو',value:String(v.scenario||'راجع الملف المرفق.').slice(0,1024)}];if(a.reason)e.fields.push({name:'سبب الرفض',value:a.reason.slice(0,1000)});if(a.reviewer)e.fields.push({name:'راجعه',value:`<@${a.reviewer}>`});e.footer={text:`OMEN • طلب #${a.id} • Discord ${a.discord_id}`};return e;}
export function reviewComponents(a){return a.status==='pending'?[{type:1,components:[{type:2,style:3,label:'قبول الطلب',custom_id:`omen:accept:${a.id}`},{type:2,style:4,label:'رفض مع السبب',custom_id:`omen:reject:${a.id}`}]}]:[{type:1,components:[button('فتح لوحة المراجعة','#admin')]}]}
// Reconstruct only messages authored by a trusted bot in the configured review channel.
export function applicationFromMessage(message,fullText=''){
 const e=message.embeds?.[0],content=message.content||'',fields=e?.fields||e?.data?.fields||[];
 const first=(...names)=>fields.find(f=>names.includes(f.name))?.value;
 const rawId=/#(\d+)/.exec(content+' '+(e?.title||e?.data?.title||''))?.[1];
 const user=/<@!?(\d{17,20})>/.exec(content+' '+(e?.description||e?.data?.description||''))?.[1]||/Discord (\d{17,20})/.exec(e?.footer?.text||e?.data?.footer?.text||'')?.[1];
 if(!rawId||!user)return null;const id=Number(rawId);if(!Number.isSafeInteger(id))return null;
 const status=/تم القبول|تم قبول|الحالة: \*\*مقبول/.test(content+' '+(e?.description||''))?'accepted':/تم الرفض|الحالة: \*\*مرفوض/.test(content+' '+(e?.description||''))?'rejected':'pending';
 const values={character:first('الشخصية')||/^\*\*(.*?)\*\*/.exec(e?.description||'')?.[1]||'شخصية مسترجعة',age:first('العمر')||'',experience:first('الخبرة','الخبرة في الرول بلاي')||'',story:first('القصة','قصة الشخصية')||'',scenario:first('السيناريو','التصرف في السيناريو')||''};
 for(const [key,label] of Object.entries({character:'الشخصية',age:'العمر',experience:'الخبرة',story:'القصة',scenario:'السيناريو'})){const match=new RegExp('(?:^|\\n\\n)'+label+':\\n([\\s\\S]*?)(?=\\n\\n(?:الشخصية|العمر|الخبرة|القصة|السيناريو):\\n|$)').exec(fullText);if(match)values[key]=match[1].trim()}
 return {id,discord_id:user,answers:JSON.stringify(values),status,reason:first('سبب الرفض')||/السبب: ([\s\S]*)/.exec(content)?.[1]?.trim()||'',created_at:message.createdTimestamp||Date.now(),reviewed_at:status==='pending'?null:message.editedTimestamp||message.createdTimestamp||Date.now(),reviewer:/بواسطة <@!?(\d{17,20})>/.exec(content)?.[1]||/<@!?(\d{17,20})>/.exec(first('راجعه')||'')?.[1]||null,review_message:message.id,recovered:true};
}
