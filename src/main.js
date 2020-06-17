import "./assets/index.css"
import "./assets/index.less"
console.log("我在学习webpack");

function a() {
    return new Promise((resolve,reject)=>{
        console.log(1111)
        resolve()
    })
}

function b() {
    setTimeout(()=>{
        console.log(222222)
    },5000)
}

function c() {
    console.log(333333)
}

a();
b();
c();