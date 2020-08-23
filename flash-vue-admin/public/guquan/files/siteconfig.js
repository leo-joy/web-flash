/**
 * 股权图通用变量配置
 */
var Duohuo ={};
//INDEX_URL="/dev-api"; 
INDEX_URL="/prod-api"; 
INDEX_URL_A=""; 
INDEX_ROOT="";
CMS_STYLE_ROOT="/material/theme/chacha/cms";
PLUGINS_ROOT="/material/plugins";
var domainStr = window.location.host;
var domainArr = domainStr.split('.');
var subDomain = domainArr[0];
if(subDomain === 'pinpai'){
    INDEX_URL_A = 'https://faren.agile.com.cn';
}