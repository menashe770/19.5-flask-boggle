from flask import Flask, render_template, session, request, jsonify
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


@app.route("/check-word")
def check_word():
    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({"result": response})
