import numpy as np
import pandas as pd
from functools import reduce
from os import path

## Load the data
#### Why can't I keep the data files in the data folder???!!!!

# file = r'data\first_model\courses_w_sim.csv'
# print(file)
# print(path.normpath('data/first_model/courses_w_sim.csv'))
# print("path ", path.normpath('courses_w_sim.csv'))
# c_df = pd.read_csv(file)
# c_df = pd.read_csv(path.normpath('data/first_model/courses_w_sim.csv'))

c_df = pd.read_csv('../data/first_model/courses_w_sim.csv')


def get_concentrations():
    print('Concentration: ')
    concentr = c_df.level.unique()
    return concentr


def get_courses(inConcentration):
    print(inConcentration)
    courses = c_df[c_df['level'] == inConcentration]

    # print(type(courses))  #fyi this is of type panda DataFrame
    # print(courses.iloc[0, 3])
    # print(courses.shape[0])
    # print(courses.values[3])
    # #print(courses.iloc[s2, 3])

    lst = []
    for i in range(courses.shape[0]):
        lst.append(courses.iloc[i, 3])

    return lst



# def single_course_to_job(k):
#     print('\nConcentration: ')
#     concentr = c_df.level.unique()
#     i = 0
#     for level in concentr:
#         print('    {}: {}'.format(i, level))
#         i += 1
#     s1 = int(input('\nSelect concentration: '))
#     selected_level = concentr[s1]
#
#     print('\nCourse: ')
#     courses = c_df[c_df['level'] == selected_level]
#     for i in range(courses.shape[0]):
#         print('    {}: {}{}-{}'.format(i, courses.iloc[i, 1], courses.iloc[i, 2], courses.iloc[i, 3]))
#         i += 1
#     s2 = int(input('\nSelect course: '))
#     selected_course = '{}{}'.format(courses.iloc[s2, 1], courses.iloc[s2, 2])
#     course_name = courses.iloc[s2, 3]
#     sim = map(int, courses.iloc[s2, 6].split(',')[:k])
#
#     print('Recommend job:')
#     for i in sim:
#         print('    {} - {}'.format(j_df.iloc[i, 0], j_df.iloc[i, 1]))



