const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login')
  }

  static async loginPost(req, res) {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ where: { user_email: email } })

    if (!user) {
      console.log('Erro: E-mail não cadastrado ou incorreto!')
      req.flash('info', 'E-mail não cadastrado ou incorreto!')
      res.render('auth/login')

      return
    }

    // Check if password match
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      console.log('Erro: Senha inválida!')
      req.flash('info', 'Senha inválida!')
      res.render('auth/login')

      return
    }

    req.session.userid = user.id

    console.log('Info: Autenticação realizada com sucesso!')
    req.flash('info', 'Autenticação realizada com sucesso!')

    req.session.save(() => {
      res.redirect('/')
    })
  }

  static register(req, res) {
    res.render('auth/register')
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body

    if (password != confirmpassword) {
      console.log('Erro: As senhas não conferem.')
      req.flash('info', 'As senhas não conferem tente novamente!')
      res.render('auth/register')

      return //res.status(400).render('auth/register', { messages: req.flash('info') });
    }

    const checkIfUserExist = await User.findOne({
      where: { user_email: email }
    })
    if (checkIfUserExist) {
      req.flash('info', 'E-mail já cadastrado!')
      res.render('auth/register')

      return
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = {
      name,
      user_email: email,
      password: hashedPassword
    }

    try {
      const createdUser = await User.create(user)

      // Initialize session
      req.session.userid = createdUser.id

      console.log('Erro: Usuário criado com sucesso!')
      req.flash('info', 'Usuário criado com sucesso!')

      req.session.save(() => {
        res.redirect('/')
      })
    } catch (err) {
      console.log(err)
    }
  }

  static logout(req, res) {
    req.session.destroy()
    res.redirect('/login')
  }
}
