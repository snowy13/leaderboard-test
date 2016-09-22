contract saflokKeyFactory {
  string storedData;

  function set(string x) {
    storedData = x;
  }

  function get() constant returns (string retVal) {
    return storedData;
  }
}
