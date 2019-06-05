from flask import Flask
from flask import render_template, request, jsonify
import json
from static.data.calculate_sim import *

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def main():
    return render_template('index.html')

@app.route('/selection', methods=['POST'])
def selection():
    data = request.get_json();
    course_idx = data['a']

    job_idx = get_job_sim(course_idx)
    job_idx_by_groups = get_group_sim(course_idx)

    toReturn = {'course_idx' : course_idx, 'job_idx' : job_idx, 'job_idx_by_groups' : job_idx_by_groups}
    return jsonify(toReturn)
    #return render_template('index.html')


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
    

if __name__ == '__main__':
    # app.run()
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)