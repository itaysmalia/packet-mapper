#!/usr/bin/env python3
from packet_mapper import PacketsMapper
from flask import Flask,send_from_directory
import requests
import json
import sys
import logging
app = Flask(__name__)
log = logging.getLogger('werkzeug')
log.disabled = True
app.logger.disabled = True
queue = []

@app.route('/')
def index():
    return send_from_directory('pages','index.html')

@app.route("/pkt")
def send_pkt():
    global queue
    if queue:
        data=queue.pop(0)
        print("\r%d packets in queue" % len(queue),end="\r")
        return data
    else:
        return {}

mapper = None
 
@app.route("/mydata")
def send_mydata():
    return mapper.get_my_location()
  
@app.route('/static-files/<path:path>')
def static_files(path):
    return send_from_directory('static',path)
    

def callback(data):
    global queue
    MAX_PACKETS = 500 #you can change it, my advise, *!DON'T!*
    if len(queue) < MAX_PACKETS:
        queue.append(data)
        print("\r%d packets in queue" % len(queue),end="\r")


def main():
    global mapper
    print("Welcome to packets mapping server!!")
    mapper = PacketsMapper(callback,useProxy=False,threaded=True)
    mapper.start()
    app.run()
    

if __name__ == "__main__":
    main()