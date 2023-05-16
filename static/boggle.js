class BoggleGame {
  constructor() {
    $('.add-word').on('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const $word = $('.word');

    let word = $word.val();
    if (!word) return;

    const response = await axios.get('/check-word', { params: { word: word } });
  }
}

let game = new BoggleGame();
