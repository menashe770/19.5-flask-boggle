class BoggleGame {
  constructor() {
    $('.add-word').on('submit', this.handleSubmit.bind(this));

    this.score = 0;
  }

  showMessage(msg) {
    $('.msg').text(msg);
  }

  async handleSubmit(e) {
    e.preventDefault();

    const $word = $('.word');

    let word = $word.val();
    if (!word) return;

    const response = await axios.get('/check-word', { params: { word: word } });

    if (response.data.result === 'not-word') {
      this.showMessage(`${word} is not a valid English word`);
    } else if (response.data.result === 'not-on-board') {
      this.showMessage(`${word} is not on this board`);
    } else {
      this.score += word.length;
      this.showMessage(`${word} is A-OK!`);
    }

    // this.showMessage(response.data.result);
  }
}

let game = new BoggleGame();
