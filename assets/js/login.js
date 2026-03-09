const SCRIPT_URL = "ضع رابط exec هنا";

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
