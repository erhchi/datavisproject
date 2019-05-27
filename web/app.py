from flask import Flask
from flask import render_template, request

from data.first_model.webdata import *


app = Flask(__name__)

concentrations = get_concentrations()
a = {i:x for i,x in enumerate(concentrations)}
print(a)

@app.route('/')
@app.route('/index')
def main():
    return render_template('index.html', concentrations=a)

@app.route('/conc')
def get_concentrtions():
    print(a)
    return a


@app.route('/selection', methods=['POST'])
def selection():
    #data = request.form['courseDrop']
    #data = request.form['hack']
    data = request.form.getlist('list')
    x = request.form.getlist('coursesX')
    print(data)
    print(x)
    return render_template('index.html')
#
# @app.route('/concentration', methods=['POST'])
# def concentration():
#     data = request.form['concentration']
#     return render_template('index.html',concentrations=concentrations, courses=get_courses(data))
#
#
# @app.route('/courses', methods=['POST'])
# def courses():
#     #should be a multiselect list?
#     #data = request.form['courses']
#     #for the list
#     data = request.form.getlist('courses')
#     print(type(data))
#     print(data)
#     return render_template('index.html', concentrations=concentrations)






if __name__ == '__main__':
    app.run()
