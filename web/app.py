from flask import Flask
from flask import render_template, request, redirect, url_for, jsonify

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
    print(course_idx)

    job_idx = get_job_sim(course_idx)

    job_idx_by_groups = get_group_sim(course_idx)

    with open('../web/static/data/index_by_sim.js', 'w') as outfile:
        outfile.write("var course_idx = ")
        json.dump(course_idx, outfile)
        outfile.write("\nvar job_idx = ")
        json.dump(job_idx, outfile)
        outfile.write("\nvar job_idx_by_groups = ")
        json.dump(job_idx_by_groups, outfile)
    outfile.close()

    toReturn = {'course_idx' : course_idx, 'job_idx' : job_idx, 'job_idx_by_groups' : job_idx_by_groups}
    return jsonify(toReturn)
    #return render_template('index.html')




if __name__ == '__main__':
    app.run()
