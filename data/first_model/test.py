import numpy as np
import pandas as pd
from functools import reduce

## Load the data
c_df = pd.read_csv('courses_w_sim.csv')
j_df = pd.read_csv('jobs_w_sim.csv')



def single_course_to_job(k):
    print('\nConcentration: ')
    concentr = c_df.level.unique()
    i = 0
    for level in concentr:
        print('    {}: {}'.format(i,level))
        i +=1
    s1 = int(input('\nSelect concentration: '))
    selected_level = concentr[s1]

    print('\nCourse: ')
    courses = c_df[c_df['level']==selected_level]
    for i in range(courses.shape[0]):
        print('    {}: {}{}-{}'.format(i,courses.iloc[i,1],courses.iloc[i,2],courses.iloc[i,3]))
        i +=1
    s2 = int(input('\nSelect course: '))
    selected_course = '{}{}'.format(courses.iloc[s2,1],courses.iloc[s2,2])
    course_name = courses.iloc[s2,3]
    sim = map(int,courses.iloc[s2,6].split(',')[:k])

    print('Recommend job:')
    for i in sim:
        print('    {} - {}'.format(j_df.iloc[i,0],j_df.iloc[i,1]))


def get_concentrations():
    print('\nConcentration: ')
    concentr = c_df.level.unique()
    return concentr




def single_job_to_course():
    pass
def multi_course_to_job():
    pass


def main():
    '''
    Mode 1: Single course to job
    Mode 2: Single job to course
    Mode 3: Multi course to a job
    mode 4: 
    enter 0 to exit'''
    

    while True:
        print('-'*70)
        print(main.__doc__+'\n')
        mode = int(input('Select mode: '))

        if not mode:
            print('Program end.')
            break
        elif mode ==1:
            k = int(input('Enter the num of jobs you\'d like to see: '))
            single_course_to_job(k)
            
        elif mode ==2:
            single_job_to_course()
            
        elif mode ==3:
            multi_course_to_job()
            
        elif mode ==4:
            pass
            
        
            
    
main()


## user prompt -- select course




## 
