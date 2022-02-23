export class MStoreCampaignType {
 name = '';
 title = '';
  desc= '';
 img= '';
 code=''
 public static of(code: string, name: string, title: string, desc:string, img: string): MStoreCampaignType{
   const m = new MStoreCampaignType();
   m.name = name;
   m.title = title;
   m.desc = desc;
   m.img = img;
   m.code = code;
   return m;
 }

}
