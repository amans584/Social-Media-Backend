const bcrypt = require('bcrypt')

function groupBy(array, property) {
  return array.reduce((result, currentItem) => {
    const key = currentItem[property];
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(currentItem);
    return result;
  }, {});
}

async function makeHash(password){
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw new Error('Error hashing password: ' + err.message);
  }
}

async function checkPassword(password, storedHash) {
  try {
    const match = await bcrypt.compare(password, storedHash);
    return match;
  } catch (err) {
    throw new Error('Error verifying password: ' + err.message);
  }
}

module.exports = {
  groupBy,
  makeHash,
  checkPassword
}
