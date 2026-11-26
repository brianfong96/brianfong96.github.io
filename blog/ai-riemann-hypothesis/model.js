/* Exact finite calculations and illustrative exponent algebra. */
(function(root){
'use strict';
const api=(function makeModel(){
  const gamma=0.5772156649015329;
  function sieve(limit){const composite=new Uint8Array(limit+1), primes=[];for(let p=2;p<=limit;p++){if(composite[p])continue;primes.push(p);if(p*p<=limit)for(let j=p*p;j<=limit;j+=p)composite[j]=1;}return primes;}
  function primeData(limit){const weights=new Float64Array(limit+1),psi=new Float64Array(limit+1),weighted=new Float64Array(limit+1),primes=sieve(limit);for(const p of primes){for(let j=p;j<=limit;j*=p){weights[j]=Math.log(p);if(j>limit/p)break;}}for(let n=1;n<=limit;n++){psi[n]=psi[n-1]+weights[n];weighted[n]=weighted[n-1]+weights[n]/n;}return {primes,psi,weighted};}
  function error(data,x){const n=Math.floor(x);return {psi:data.psi[n],g:x*data.weighted[n]-data.psi[n]-x*Math.log(x)+(1+gamma)*x};}
  function toy(x,m){return {fixed:x/m,repeated:m,total:x/m+m};}
  function exponents(a,k,n,r=1){return [1-a,1+a-k,r*a,k-2*n];}
  function lattice(r){const pairs=[];for(let a=-5;a<=5;a++)for(let b=-5;b<=5;b++)if(a*a+b*b===r)pairs.push([a,b]);return pairs;}
  return {sieve,primeData,error,toy,exponents,lattice};
})();
if(typeof module==='object' && module.exports) module.exports=api;
else root.RiemannModel=api;
})(typeof window==='undefined'?globalThis:window);
