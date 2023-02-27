const createResponse = (data, message = null, error = false) => {
  return {
    data,
    message,
    error,
  };
};

function *generator(num) {
  let index = num; 
  while(true) {
    yield index++;
  }
}

module.exports = { createResponse, generator  };