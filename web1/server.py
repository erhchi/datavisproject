## cd Desktop/DePaul/CSC595/final/py_to_js/
## export FLASK_APP=server.py
## python3 -m flask run

from flask import Flask, send_from_directory
from flask import request
import json
from py_module.calculate_sim import *


app = Flask(__name__)




## data loaded in server memory

@app.route('/<path:path>')
def startup(path):
    return send_from_directory('.', path)


# @app.route('/test/<input_idx>')
# def run_ML(input_idx):
#     input_idx = list(map( int, input_idx.split(',') ))
#     ## get sorted job index for all selected courses
#     sorted_job_idx = get_job_sim(input_idx)
#     return ','.join(map(str,sorted_job_idx))


@app.route('/get_sim/')
def get_sim():
    data = request.args.get('data')
    if not data:
        return ''

    input_idx = list(map(int, data.split(',')))
    ## get sorted job index for all selected courses
    sorted_job_idx = get_job_sim(input_idx)
    return ','.join(map(str, sorted_job_idx))

@app.route('/get_groupby_sim/')
def get_groupby_sim():
    data = request.args.get('data')
    if not data:
        return ''

    input_idx = list(map(int, data.split(',')))
    dic = get_group_sim(input_idx)
    return json.dumps(dic)