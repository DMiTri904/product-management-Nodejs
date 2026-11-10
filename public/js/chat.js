import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', data => {
  const myId = document.querySelector('[my-id]').getAttribute('my-id')
  const body = document.querySelector('.chat .inner-body')
  const div = document.createElement('div')
  let htmlFullName = ''
  if (myId == data.userId) {
    div.classList.add('inner-outgoing')
  } else {
    div.classList.add('inner-incoming')
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`
  }
  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `
  body.appendChild(div)
  body.scrollTop = body.scrollHeight
})

//SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector('.chat .inner-body')
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight
}
// Scroll Chat To Bottom

// emoji-picker
//Show Popup
const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(buttonIcon, tooltip)
  buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown')
  }
}

//Insert Icon Input
const emojiPicker = document.querySelector('emoji-picker')
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  )
  emojiPicker.addEventListener('emoji-click', e => {
    const icon = e.detail.unicode
    inputChat.value = inputChat.value + icon
  })
}
// emoji-picker
