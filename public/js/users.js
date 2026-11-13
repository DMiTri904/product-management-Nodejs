// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll('[btn-add-friend]')
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.add('add')
      const userId = button.getAttribute('btn-add-friend')

      socket.emit('CLIENT_ADD_FRIEND', userId)
    })
  })
}
// Chức năng gửi yêu cầu

// Chức năng hủy KB
const listBtnlistBtnCancelFriend = document.querySelectorAll(
  '[btn-cancel-friend]'
)
if (listBtnlistBtnCancelFriend.length > 0) {
  listBtnlistBtnCancelFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.remove('add')
      const userId = button.getAttribute('btn-cancel-friend')

      socket.emit('CLIENT_CANCEL_FRIEND', userId)
    })
  })
}
// Chức năng hủy KB
