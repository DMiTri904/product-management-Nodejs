// Delete role
const buttonDelete = document.querySelectorAll('[button-delete]')
if (buttonDelete.length > 0) {
  const formDelete = document.querySelector('#form-delete-role')
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
// End Delete item

// --- PERMISSIONS ---
const tablePermission = document.querySelector('[table-permissions]')
if (tablePermission) {
  const buttonSubmit = document.querySelector('[button-submit]')
  buttonSubmit.addEventListener('click', () => {
    let permissions = []

    const rows = tablePermission.querySelectorAll('[data-name')

    rows.forEach(row => {
      const name = row.getAttribute('data-name')
      const inputs = row.querySelectorAll('input')
      if (name === 'id') {
        inputs.forEach(input => {
          const id = input.value
          permissions.push({
            id,
            permissions: []
          })
        })
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked
          if (checked) {
            permissions[index].permissions.push(name)
          }
        })
      }
    })
    console.log(permissions)

    if (permissions.length > 0) {
      const formChangePermission = document.querySelector(
        '#form-change-permissions'
      )
      const inputPermission = formChangePermission.querySelector(
        "input[name='permissions']"
      )
      inputPermission.value = JSON.stringify(permissions)
      formChangePermission.submit()
    }
  })
}
// --- END PERMISSIONS ---

// Permissions Data Default
const dataRecords = document.querySelector('[data-records]')
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute('data-records'))
  const tablePermission = document.querySelector('[table-permissions]')

  records.forEach((record, index) => {
    const permissions = record.permissions
    permissions.forEach(permission => {
      const row = tablePermission.querySelector(`[data-name="${permission}"]`)

      const input = row.querySelectorAll('input')[index]
      input.checked = true
    })
  })
}
// Permissions Data Default
