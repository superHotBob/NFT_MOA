const Pool = require('pg').Pool
const pool = new Pool({
  user: 'iuevfshp',
  host: 'dumbo.db.elephantsql.com',
  database: 'iuevfshp',
  password: 'ywDJ5rXh3ot6jqjRqw-X83xwzPDQ222c',
  port: 5432
})
const getUsers = (request, response) => {
  pool.query('SELECT * FROM my_users ORDER BY user ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
const updateBlock = (a) => {
  pool.query('UPDATE lastblock SET block = $1', [a], (error, results) => {
    if (error) {
      throw error
    }
  })
}
const readBlock = () => {
  pool.query('SELECT block FROM  lastblock ').then((res) => {
    return res.rows[0].block
  })
}

const transactions = (req, res) => {
  pool.query('SELECT * FROM  home  ORDER BY id DESC', (error, results) => {
    if (error) {
      throw error
    }
    res.json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.walletAddress)
  console.log(id)

  pool.query(
    'SELECT * FROM my_users WHERE WalletAddress = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}
const writeActivity = (a, b, c) => {
  console.log(a, b, c)
  pool.query(
    'INSERT INTO home (author, newuser, tokenid) VALUES ($1,$2,$3)',
    [a, b, c],
    (error, results) => {
      if (error) {
        throw error
      }
    }
  )
}
const writeMinting = (a, b, c, d, e) => {
  console.log(a, b, c, d, e)
  pool.query(
    'INSERT INTO tokens  VALUES ($1, $2, $3 , $4 ,$5 )',
    [a, b, c, d, e],
    (error, results) => {
      if (error) {
        throw error
      }
    }
  )
}
const createUser = (request, response) => {
  const { walletAddress } = request.body
  console.log(walletAddress)
  //   Const myInsert = `INSERT INTO users  VALUES ${1}`
  pool.query(
    'UPDATE users  SET user = $1 WHERE user = $1',
    [walletAddress],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results}`)
    }
  )
}
const addTransfer = (request, response) => {
  const { from, to, tokenId, date } = request.body
  pool.query(
    'INSERT INTO transfer (to,from,date,tokenId) VALUE  from = $1, to = $2, tokenId = $3 , date = $4 ',
    [from, to, tokenId, date],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Transer add to base form: ${from}`)
    }
  )
}

const updateUser = (request, response, next) => {
  const { walletAddress, date = 1111111, balance, firstdate = new Date() } = request.body

  console.log(balance, walletAddress, date, firstdate)

  pool.query(
    'SELECT user FROM my_users WHERE user = $1',
    [walletAddress],
    (error, results) => {
      if (error) {
        pool.query(
          'INSERT my_users VALUES balance = $1, user = $2 ',
          [balance, walletAddress, date, firstdate],
          (error, results) => {
            if (error) {
              throw error
            }
          }
        )
        next()
      } else {
        pool.query(
          'UPDATE my_users SET balance = $1 WHERE user = $2',
          [balance, walletAddress],
          (error, results) => {
            if (error) {
              throw error
            }
          }
        )
        next()
      }
    }
  )
}

const deleteUser = (request, response) => {
  const { walletAddress } = request.body
  pool.query(
    'DELETE FROM my_users WHERE user = FSDFSDF',
    [walletAddress],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${walletAddress}`)
    }
  )
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  addTransfer,
  deleteUser,
  writeActivity,
  updateBlock,
  readBlock,
  transactions,
  writeMinting
}
