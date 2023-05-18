from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    def setUp(self):
        """Stuff to do before every test."""

        self.app = app.test_client()
        app.config["TESTING"] = True

    def test_homepage(self):
        """Test homepage route"""
        with self.app as client:
            response = client.get("/")
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"<h1>Boggle!</h1>", response.data)

    def test_new_game(self):
        """Test new game button"""
        with self.app as client:
            with client.session_transaction() as sess:
                sess["board"] = boggle_game.make_board()

            response = client.get("/")
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"Current Score:", response.data)

    def test_check_word_valid(self):
        """Test check-word route with a valid word"""
        with self.app as client:
            with client.session_transaction() as sess:
                sess["board"] = [
                    ["A", "B", "C", "D", "E"],
                    ["F", "G", "H", "I", "J"],
                    ["K", "L", "M", "N", "O"],
                    ["P", "Q", "R", "S", "T"],
                    ["U", "V", "W", "X", "Y"],
                ]

            response = client.get("/check-word?word=ABCD")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.get_json()["result"], "ok")

    def test_check_word_invalid(self):
        """Test check-word route with an invalid word"""
        with self.app as client:
            with client.session_transaction() as sess:
                sess["board"] = [
                    ["A", "B", "C", "D", "E"],
                    ["F", "G", "H", "I", "J"],
                    ["K", "L", "M", "N", "O"],
                    ["P", "Q", "R", "S", "T"],
                    ["U", "V", "W", "X", "Y"],
                ]

            response = client.get("/check-word?word=XYZ")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.get_json()["result"], "not-word")

    def test_score_game(self):
        """Test score-game route"""
        with self.app as client:
            with client.session_transaction() as sess:
                sess["board"] = boggle_game.make_board()

            response = client.post("/keep-score", json={"score": 10})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.get_json()["success"], True)


if __name__ == "__main__":
    import unittest

    unittest.main()
