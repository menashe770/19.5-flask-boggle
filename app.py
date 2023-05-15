from flask import Flask, render_template, session
from boggle import Boggle

boggle_game = Boggle()

app = Flask(__name__)
app.config["SECRET_KEY"] = "seekret"


@app.route("/")
def homepage():
    """Show Board"""

    board = boggle_game.make_board()
    session["board"] = board

    return render_template("index.html", board=board)
