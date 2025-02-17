const users = {};
const respondJSON = (req, res, status, object) => {
  const content = JSON.stringify(object);
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };
  res.writeHead(status, headers);
  if (req.method !== 'HEAD') { res.write(content); }
  res.end();
};
const getUsers = (req, res) => {
  const responseJSON = {
    users,
  };
  return respondJSON(req, res, 200, responseJSON);
};
const addUsers = (req, res) => {
  // parse body
  let body = '';
  req.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });
  req.on('data', (chunk) => {
    // console.log(`on req data: ${chunk.toString()}`);
    body += chunk.toString();
  });
  req.on('end', () => {
    // console.log(`body string: ${body}`);
    // if (!body) {
    //     body = {
    //         id: "jsonFailure",
    //         message: "Invalid JSON"
    //     }
    //     return respondJSON(req, res, 400, body);
    // }
    try { req.body = JSON.parse(body); } catch (e) {
      body = {
        id: 'jsonFailure',
        message: 'Invalid JSON',
      };
      return respondJSON(req, res, 400, body);
    }
    let resCode = 204;
    const responseJSON = {};
    const { name, age } = req.body;
    if (!name || !age) {
      responseJSON.id = 'missingParams';
      responseJSON.message = 'Missing name or age';
      return respondJSON(req, res, 400, responseJSON);
    }
    // if user does not exist yet, create a new user
    if (!users[name]) {
      resCode = 201;
      users[name] = {
        name,
      };
    }
    users[name].age = age;
    if (resCode === 201) {
      responseJSON.message = 'User Created Successfully';
    }
    return respondJSON(req, res, resCode, responseJSON);
  });
};
const notFound = (req, res) => {
  const responseJSON = {
    id: 'notFound',
    message: 'Page not found.',
  };
  return respondJSON(req, res, 404, responseJSON);
};

module.exports = {
  getUsers,
  notFound,
  addUsers,
};
