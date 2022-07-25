class GruposRequest {
  constructor() {
    this.url = "http://localhost:8080/api/grupos/";
  }
  async getgrupos() {
    return await fetch(this.url).then((r) => r.json);
  }
  async getgrupo(id) {
    return await fetch(this.url + id).then((r) => r.json);
  }
}

module.exports = GruposRequest;
