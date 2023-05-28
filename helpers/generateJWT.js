import jwt from 'jsonwebtoken'

/**
 * Generate a random unique token
 * @returns Unique JWT
 */
const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

export default generateJWT