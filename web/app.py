from flask import Flask
from flask import render_template


app = Flask(__name__)


@app.route('/')
@app.route('/index')
def home():
    return render_template('index.html')

# concentrations = {
#
# }


if __name__ == '__main__':
    app.run()
