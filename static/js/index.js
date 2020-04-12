let i = 0;
const conteiner = $('.conteiner')
let mydata = {}
let countriesData = {}
let totalcount = 0;
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
                countriesData[data.country_code] = {count:0};
                const dashboard = $('div.dashboard')
                dashboard.css('--h',`${Object.keys(countriesData).length * 5.5}vh`)
                dashboard.append(`<div class="country ${data.country_code}"><img alt="${data.country}" src='https://www.countryflags.io/${data.country_code}/flat/64.png' /><span style="--w:${(countriesData[data.country_code].count / totalcount * 70).toFixed(0)}%" class='bar'></span><p class='precent'>${(countriesData[data.country_code].count / totalcount * 100).toFixed(2)}%</p></div><hr />`)

            }
            Object.keys(countriesData).map(code => {
                const element = $('div.dashboard div.country.' + code)
                element.find('p').html(`${(countriesData[code].count / totalcount * 100).toFixed(2)}%`)
                element.find('span').css('--w',`${(countriesData[code].count / totalcount * 100).toFixed(0)}%`)
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

