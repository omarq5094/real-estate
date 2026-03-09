const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBRXleXMaOtaEsA3m9HfbX2zArAGSvsiaSSp0-1gbgOqE2hiL5_czP5RY3c9VMgOEmCw/exec";

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async function(e){

e.preventDefault();

const phone=document.getElementById("phone").value.trim();
const password=document.getElementById("password").value.trim();

const data=new URLSearchParams();

data.append("phone",phone);
data.append("password",password);
data.append("action","login");

try{

const res=await fetch(SCRIPT_URL,{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded"
},
body:data.toString()
});

const text=await res.text();
const result=JSON.parse(text);

if(result.success){

localStorage.setItem("userPhone",phone);

window.location.href="dashboard.html";

}else{

msg.innerText="بيانات الدخول غير صحيحة";

}

}catch(err){

msg.innerText="خطأ في الاتصال";

}

});
