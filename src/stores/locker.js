//EncoderTable ve DecoderTable
const base="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
import tables from '@/utils/tables';
const encodertable = tables.encoder;
const decodertable = tables.decoder;
const numhex = ["F","E","D","C","B","A","0","1","2","3","4","5","6","7","8","9"]

export const StoreData=(data)=>{
    let _data={...data}    
_data.gJ=ctp(data.token);
delete _data.token;
localStorage.setItem('_bufferUI',StrToHex(JSON.stringify(_data)));
}
export const GetData=()=>{
    let _data;
    _data=HexToStr(localStorage.getItem('_bufferUI'));
    if(!_data)return null;
    _data=JSON.parse(_data);
    let data={..._data}
    data.token=dtp(_data.gJ);
    return data;  
}
export const RemoveData=()=>{
      localStorage.removeItem('_bufferUI');  
}
export const rtp=(token)=>{
    if(token==null)return;
let parts=token.split('.');
let tmp=""
for(let i=0;i<parts[2].length;i++)
tmp+=(base[Math.floor(Math.random()*(base.length-1))]);
return parts[0]+"."+parts[1]+"."+tmp;
}
const StrToHex=(text)=> {
    if(text==null)return;
    let len = text.length;
    let hexstr = "";
    let code;
    let a, b;
    for (let i = 0; i < len; i++) {
        code = String(text[i]).charCodeAt();
        a = parseInt(code / 16);
        b = parseInt(code % 16);
        hexstr += numhex[a] + numhex[b];
    }
    return hexstr;
}
const HexToStr=(hexstr)=> {
     if(hexstr==null)return;
    let hexnum = Array.from({length:256},(_,i)=>i);
    for (let i = 0; i < 16; i++) {
        hexnum[numhex[i].charCodeAt()] = i;
    }
    let len = hexstr.length;
    let str = "";
    let code;
    let a, b;
    for (let i = 1; i < len; i += 2) {
        a = hexnum[hexstr[i - 1].charCodeAt()]
        b = hexnum[hexstr[i].charCodeAt()]
        code = a * 16 + b;
        str += String.fromCharCode(code);
    }
    return str;
}
const ctp=(token)=>{  
    if(token==null)return;   
let parts=token.split('.');
let tmp=ct(parts[2]);
return parts[0]+"."+parts[1]+"."+tmp;
}
const dtp=(token)=>{ 
    if(token==null)return;   
let parts=token.split('.');
let tmp=dt(parts[2]);
return parts[0]+"."+parts[1]+"."+tmp;
}

const ct=(data)=>{
let len=data.length;
let crypted=""
let coded=0;
for(let i=0;i<len;i++)
{    
coded=encodertable[data[i].charCodeAt()];
crypted+=String.fromCharCode(coded);
}  
return crypted;
}
const dt=(_data)=>{   
let decrypted=""
let coded=0;
let data=_data;
let len=data.length;
for(let i=0;i<len;i++)
{    
coded=decodertable[data[i].charCodeAt()];
decrypted+=String.fromCharCode(coded);
}  
return decrypted;
}