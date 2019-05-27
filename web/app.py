from flask import Flask
from flask import render_template, request, redirect, url_for

from data.first_model.webdata import *
from data.calculate_sim import *

app = Flask(__name__)

concentrations = get_concentrations()


@app.route('/')
@app.route('/index')
def main():
    return render_template('index.html', concentrations=concentrations)


@app.route('/concentration', methods=['POST'])
def concentration():
    data = request.form['concentration']
    return render_template('index.html', concentrations=concentrations, courses=get_courses(data))


@app.route('/courses', methods=['POST'])
def courses():
    # should be a multiselect list?
    # data = request.form['courses']
    # for the list
    data = request.form.getlist('courses')
    print(type(data))
    print(data)

    return render_template('index.html', concentrations=concentrations)


@app.route('/selectedCoursePool', methods=['POST'])
def coursespool_index():
    course_idx = request.form.getlist('selectedCoursePool')

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

    return render_template('index.html')


if __name__ == '__main__':
    app.run()
