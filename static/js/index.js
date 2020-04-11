let i = 0;
const conteiner = $('.conteiner')
let mydata = {}
$.get('/mydata',(data) => {
    console.log('my data - ',data)
    mydata = data;
    document.documentElement.style.setProperty('--mylo',data.longitude)
    document.documentElement.style.setProperty('--myla',data.latitude)
    $('body').find('div#loading').remove()
    conteiner.append(`<div class=\"me\"></div>`)
})
const getpkt = () => {
    $.get('/pkt', (data) => {
        if (data.country){
            conteiner.append(`<div class=\"pkt\" style=\"--lo:${data.longitude};--la:${data.latitude}\"></div>`)
            i++; 
        }
        if (i > 50){
            conteiner.find('div.pkt:first').remove();
            i--;
        }
    })
    setTimeout(getpkt, 50);
}
setTimeout(getpkt, 50);
