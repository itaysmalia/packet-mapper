import requests
import json
class Location:
    def __init__(self,Country:str,City:str='Capital city'):
        self.Country = Country
        self.City = City
    def export_data(self)->dict:
        address = f"{self.City}, {self.Country}"
        PARAMS={
            "q":address,
            "key":"7777935a9f314d15965be1e3c0c3028d"
        }
        response = requests.get("https://api.opencagedata.com/geocode/v1/json",params=PARAMS)
        data={}
        try:
            data = json.loads(response.content)
        except:
            print('error')
            return
        result = data.get('results')[0]
        return {
            "country": result.get('components').get('country'),
            "country_code": result.get('components').get('country_code'),
            "city":result.get('components').get('city'),
            "latitude":result.get("geometry").get("lat"),
            "longitude":result.get("geometry").get("lng"),
        }
        
        
def test():
    location = Location('Israel',"TelAviv")
    data=location.export_data()
    print(data)
    
if __name__ == "__main__":
    test()