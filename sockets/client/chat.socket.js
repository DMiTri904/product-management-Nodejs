const Chat = require('../../models/chat.model')
const uploadToClouddinary = require('../../helpers/uploadToCloudinary')

module.exports = async res => {
  const userId = res.locals.user.id
  const fullName = res.locals.user.fullName
  _io.once('connection', socket => {
    socket.on('CLIENT_SEND_MESSAGE', async data => {
      let images = []

      for (const imageBuffer of data.images) {
        const link = await uploadToClouddinary(imageBuffer)
        images.push(link)
      }
      // Lưu vào database
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images
      })
      await chat.save()

      //Trả data về cho Client
      _io.emit('SERVER_RETURN_MESSAGE', {
        userId,
        fullName,
        content: data.content,
        images
      })
    })

    socket.on('CLIENT_SEND_TYPING', type => {
      socket.broadcast.emit('SERVER_RETURN_TYPING', {
        userId,
        fullName,
        type
      })
    })
  })
}
