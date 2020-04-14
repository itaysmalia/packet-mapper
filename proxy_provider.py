import proxyscrape
class ProxyProvider:
    def __init__(self):
        self.proxy_collector = proxyscrape.create_collector('my-collector', 'http')
        self.proxy = self.proxy_collector.get_proxy()
        
    def refresh(self):
        self.proxy = self.proxy_collector.get_proxy()
        
    def export_proxy_url(self) -> str:
        return f"http://{self.proxy.host}:{self.proxy.port}"
    