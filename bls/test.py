import requests
import prettytable
import json

def runTestCode():

    headers = {'Content-type': 'application/json'}
    #data = json.dumps({"seriesid": ['CEU0800000003'],"startyear":"2017", "endyear":"2018"})

    # data = json.dumps({"seriesid": ['OEUN000000011100011000001'], "startyear": "2018", "endyear": "2018"})
    # p = requests.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', data=data, headers=headers)

    data = json.dumps({"seriesid": ['OEUN000000000000015113201'],
                       "registrationKey": "b864acac3e794adc9effc291c6ab8506",
                       "startyear": "2018", "endyear": "2018"
                       })
    p = requests.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', data=data, headers=headers)

    #b864acac3e794adc9effc291c6ab8506

    json_data = json.loads(p.text)

    print(p.text)

    output = open("data.txt", "w")
    output.write(p.text)
    output.close()

    for series in json_data['Results']['series']:

        x=prettytable.PrettyTable(["series id","year","period","value","footnotes"])
        seriesId = series['seriesID']

        for item in series['data']:
            year = item['year']
            period = item['period']
            value = item['value']
            footnotes=""
            for footnote in item['footnotes']:
                if footnote:
                    footnotes = footnotes + footnote['text'] + ','
            if 'M01' <= period <= 'M12':
                x.add_row([seriesId,year,period,value,footnotes[0:-1]])

        output = open(seriesId + '.txt','w')
        output.write (x.get_string())
        output.close()


runTestCode()

