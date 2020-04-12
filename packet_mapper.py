from scapy.all import *
import proxyscrape
import requests
from proxy_provider import ProxyProvider
from location import Location
import eventlet
import json
import threading
class PacketsMapper:
    def __init__(self,callback,useProxy=False,threaded=False):
        if not callable(callback):
            raise TypeError(f"callback is {type(callable)}, which is not callable.")
        self.callback = callback
        self.useProxy: bool = useProxy
        self.threaded: bool = threaded
        self.ignored_ips: list = []
        self.known_ips: dict = {}
        self.pkt_index: int = 0
        self.proxy = ProxyProvider() if useProxy else None
        
    def start(self):
        if self.threaded:
            thread = threading.Thread(target=self.start_sniffing)
            thread.start()
        else:
            self.start_sniffing()
            
    def start_sniffing(self):
        sniff(filter="ip",prn=self.handle_pkt)
        
    
    def handle_pkt(self,pkt):
        src_ip = pkt[IP].src
        if src_ip in self.known_ips:
            self.send_data(self.known_ips[src_ip])
            return
        if src_ip in self.ignored_ips:
            return
        if self.useProxy and self.pkt_index % 50 == 0:
            self.proxy.refresh()
        data = self.search_in_web(src_ip)
        country = data.get("geoplugin_countryName",None)
        if country:
            self.known_ips[src_ip] = Location(country,data.get('geoplugin_city',"Caplital City")).export_data()
            self.send_data(self.known_ips[src_ip])
        else:
            ignore_ip = data.get("geoplugin_request",None)
            if ignore_ip:
                self.ignored_ips.append(ignore_ip)
        
    def search_in_web(self,ip):
        url = 'http://www.geoplugin.net/json.gp'
        PARAMS = {
            'ip':ip
        }
        try:
            with eventlet.Timeout(3):
                response = None
                try:
                    if self.useProxy:
                        response = requests.get(url,params=PARAMS,proxies={'http':self.proxy.export_proxy_url()})
                    else:
                        response = requests.get(url,params=PARAMS)
                except requests.exceptions.ConnectionError:
                    print('connection problem')
                    return {}
                    
                content = response.content
                final = {}
                final = json.loads(content)
                return final
        except eventlet.timeout.Timeout:
            print('timeout searching',ip)
            return {}
        except json.decoder.JSONDecodeError:
            print("json decode error")
            print('content:',content)
        
        
    def send_data(self,data:dict):
        self.callback(data)
     
      
    def get_my_location(self):
        response = requests.get('https://api.ipify.org',params={"format":"json"})
        myip_json = json.loads(response.content)
        data = self.search_in_web(myip_json.get('ip'))
        country = data.get("geoplugin_countryName",None)
        if country:
            return Location(country,data.get('geoplugin_city',"Caplital City")).export_data()
        else:
            return {}
        
    