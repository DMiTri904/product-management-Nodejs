// Delete category
const buttonDelete = document.querySelectorAll('[button-delete]')
if (buttonDelete.length > 0) {
  const formDelete = document.querySelector('#form-delete-category')
  const path = formDelete.getAttribute('data-path')

  buttonDelete.forEach(button => {
    button.addEventListener('click', () => {
      const isDelete = confirm('Bạn có muốn xóa sản phẩm này?')
      if (isDelete) {
        const id = button.getAttribute('data-id')
        const action = `${path}/${id}?_method=DELETE`
        formDelete.action = action
        formDelete.submit()
      }
    })
  })
}
// End Delete category
