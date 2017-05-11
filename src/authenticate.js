import jwt    from 'jsonwebtoken'
import config from './config'
import User   from './models/User'

/**
 * Promise user authentication
 * @param  {{username:string,password:string,token:string}} data data for authentication
 * @param  {string} privateKey private key
 * @return {Promise} do authentication
 */
export default (data, privateKey) => new Promise((resolve, reject) => {

  /**
   * parse the argument
   * @type {object}
   */
  const { username, password, token } = data

  if (token) {
    // token authorization
    return jwt.verify(token, privateKey, (err, data) => {
      if (err) {
        reject(err ? err : data)
      } else {
        const { username } = data
        resolve({
          token    : token,
          authuser : username,
        })
      }
    })
  } else {
    // username:password authentication
    return User
      .find({ username, password })
      .then(docs => {
        if (docs.length > 0) {
          const username = docs[0].username
          jwt.sign({ username }, privateKey, { expiresIn: config.expiresIn }, (err, token) => {
            resolve({
              token: token,
              authuser: username
            })
          })
        } else {
          reject()
        }
      })
      .catch(e => process.stderr.write(e))
  }
})
