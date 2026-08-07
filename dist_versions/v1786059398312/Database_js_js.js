/**
 * SAHAKAR ERP - Database.gs (Foundation v0.1.1)
 */
const Database = (() => {
'use strict';
function getDatabase(){return (typeof SPREADSHEET_ID!=='undefined'&&SPREADSHEET_ID)?SpreadsheetApp.openById(SPREADSHEET_ID):SpreadsheetApp.getActiveSpreadsheet();}
function getSheet(sheetName){const s=getDatabase().getSheetByName(sheetName);if(!s)throw new Error('Sheet not found: '+sheetName);return s;}
function getHeaders(sheetName){const s=getSheet(sheetName);if(s.getLastColumn()===0)return[];return s.getRange(1,1,1,s.getLastColumn()).getValues()[0];}
function getHeaderMap(sheetName){const m={};getHeaders(sheetName).forEach((h,i)=>{if(h)m[String(h).trim()]=i+1;});return m;}
function getAll(sheetName){const s=getSheet(sheetName);const v=s.getDataRange().getValues();if(v.length<=1)return[];const h=v[0],o=[];for(let r=1;r<v.length;r++){const x={};h.forEach((c,i)=>x[String(c).trim()]=v[r][i]);if(String(x.is_deleted).toUpperCase()==='TRUE')continue;o.push(x);}return o;}
function findById(sheetName,id){return getAll(sheetName).find(r=>Object.keys(r).some(k=>k.toUpperCase().includes('ID')&&String(r[k])===String(id)))||null;}
function recordExists(sheetName,id){return findById(sheetName,id)!==null;}
function nextId(sheetName,prefix){let max=0;getAll(sheetName).forEach(r=>Object.keys(r).forEach(k=>{if(k.toUpperCase().includes('ID')){const v=String(r[k]);if(v.startsWith(prefix)){const n=parseInt(v.substring(prefix.length),10);if(!isNaN(n)&&n>max)max=n;}}}));return prefix+String(max+1).padStart(6,'0');}
function insertRecord(sheetName,record){const h=getHeaders(sheetName);getSheet(sheetName).appendRow(h.map(c=>record[c]??''));return true;}
function findRowNumber(sheetName,id){const s=getSheet(sheetName),v=s.getDataRange().getValues(),h=v[0],i=h.findIndex(c=>String(c).toUpperCase().includes('ID'));if(i<0)return-1;for(let r=1;r<v.length;r++){if(String(v[r][i])===String(id))return r+1;}return-1;}
function updateRecord(sheetName,id,record){const row=findRowNumber(sheetName,id);if(row<0)return false;const m=getHeaderMap(sheetName),s=getSheet(sheetName);Object.keys(record).forEach(f=>{if(m[f])s.getRange(row,m[f]).setValue(record[f]);});return true;}
function softDelete(sheetName,id){return updateRecord(sheetName,id,{is_deleted:true,updated_at:new Date().toISOString()});}
function restoreRecord(sheetName,id){return updateRecord(sheetName,id,{is_deleted:false,updated_at:new Date().toISOString()});}
function count(sheetName){return getAll(sheetName).length;}
function hasData(sheetName){return count(sheetName)>0;}
function find(sheetName,p){return getAll(sheetName).find(p)||null;}
function filter(sheetName,p){return getAll(sheetName).filter(p);}
function sort(sheetName,f,a=true){return getAll(sheetName).sort((x,y)=>x[f]===y[f]?0:(a?(x[f]>y[f]?1:-1):(x[f]<y[f]?1:-1)));}
return Object.freeze({getDatabase,getSheet,getHeaders,getHeaderMap,getAll,findById,find,filter,sort,count,hasData,recordExists,nextId,insertRecord,updateRecord,softDelete,restoreRecord});
})();