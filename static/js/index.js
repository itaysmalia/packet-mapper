let i = 0;
const conteiner = $('div.container')
let mydata = {}
let countriesData = {}
let totalcount = 0;
const colors="blue,red,green,yellow,purple,orange,black,lightblue,lightcoral".split(',')
const ctx = document.querySelector('div.pie-chart canvas').getContext('2d');
const options={
    animation: {
        duration: 0 // general animation time
    },
    hover: {
        animationDuration: 0 // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0 ,// animation duration after a resize
    legend: {
        display: true,
        position:'right',
        labels: {
            fontColor:'black'
        }
    }
}
const getpkt = () => {
    $.get('/pkt', (data) => {
        if (data.country){
            totalcount++;
            i++; 
            conteiner.append(`<div class=\"pkt\" style=\"--lo:${data.longitude};--la:${data.latitude}\"></div>`)
            if (countriesData[data.country_code]){
                countriesData[data.country_code].count++;
            }
            else{
                countriesData[data.country_code] = {count:0,name:data.country,color:colors[Object.keys(countriesData).length]};
                const dashboard = $('div.dashboard')
                let length = Object.keys(countriesData).length
                if (length <= 5){
                    dashboard.css('--h',`${length * 5.5}vh`)
                }
                dashboard.append(`<div class="country ${data.country_code}"><img alt="${data.country}" src='https://www.countryflags.io/${data.country_code}/flat/64.png' /><span style="--w:${(countriesData[data.country_code].count / totalcount * 70).toFixed(0)}%" class='bar'></span><p class='precent'>${(countriesData[data.country_code].count / totalcount * 100).toFixed(2)}%</p></div>`)

            }
            Object.keys(countriesData).map(code => {
                const element = $('div.dashboard div.country.' + code)
                element.find('p').html(`${(countriesData[code].count / totalcount * 100).toFixed(2)}%`)
                element.find('span').css('--w',`${(countriesData[code].count / totalcount * 100).toFixed(0)}%`)
                new Chart(ctx,{
                    type:'pie',
                    data:{
                        labels:Object.values(countriesData).map(c => c.name),
                        datasets:[{
                            backgroundColor: Object.values(countriesData).map(c => c.color),
                            data:Object.values(countriesData).map(c => c.count),
                        }],
                    },
                    options
                })
            })
            
        }
        if (i > 50){
            conteiner.find('div.pkt:first').remove();
            i--;
        }
    })
    setTimeout(getpkt, 50);
}
const getMyData = () => {
    $.get('/mydata',(data) => {
        console.log('my data - ',data)
        mydata = data;
        document.documentElement.style.setProperty('--mylo',data.longitude)
        document.documentElement.style.setProperty('--myla',data.latitude)
        $('body').find('div#loading').remove()
        conteiner.append(`<div class=\"me\"></div>`)
        setTimeout(getpkt, 50);
    })
}
setTimeout(getMyData,1500)

