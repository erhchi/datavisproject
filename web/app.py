from flask import Flask
from flask import render_template, request, jsonify
from web.static.data.calculate_sim import *

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



if __name__ == '__main__':
    # app.run()
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)