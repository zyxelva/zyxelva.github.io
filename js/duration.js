!function(){var n=new Date("2023/04/28 23:24:34");function m(){var m=new Date;m.setTime(m.getTime()+250),days=(m-n)/1e3/60/60/24,dnum=Math.floor(days),hours=(m-n)/1e3/60/60-24*dnum,hnum=Math.floor(hours),1===String(hnum).length&&(hnum="0"+hnum),minutes=(m-n)/1e3/60-1440*dnum-60*hnum,mnum=Math.floor(minutes),1===String(mnum).length&&(mnum="0"+mnum),seconds=(m-n)/1e3-86400*dnum-3600*hnum-60*mnum,snum=Math.round(seconds),1===String(snum).length&&(snum="0"+snum),document.getElementById("timeDate").innerHTML="本站安全运行&nbsp"+dnum+"&nbsp天",document.getElementById("times").innerHTML=hnum+"&nbsp小时&nbsp"+mnum+"&nbsp分&nbsp"+snum+"&nbsp秒"}m(),setInterval(m,1e3)}();