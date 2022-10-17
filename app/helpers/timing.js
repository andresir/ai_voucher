module.exports = {
  timing(t) {
    let d1 = new Date (t),
    d2 = new Date ( d1 );
    d2.setMinutes ( d1.getMinutes() + 10 );
    return d2.toLocaleString();
  }
}
