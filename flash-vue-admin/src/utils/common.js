/**
 * Created by zhanglei on 19/10/18.
 */

/**
 * 根据数据字典名称获取数据字典列表
 * @param {string} str
 * @returns {object}
 */
export function getDictList(str) {
  if (str) {
    var dictArr = str.split(',')
    if (dictArr.length > 0) {
      var options = []
      for (let i = 0; i < dictArr.length; i++) {
        var optionArr = dictArr[i].split(':')
        var option = {}
        option.value = optionArr[0]
        option.label = optionArr[1]
        options.push(option)
      }
      return options
    } else {
      return []
    }
  } else {
    return []
  }
}

/**
 * 根据数据字典类别中num值，获取数据字典列表中的名称
 * @param {string} str
 * @param {string} num
 * @returns {string}
 */
export function showDictLabel(str, num) {
  if (str) {
    var dictArr = str.split(',')
    if (dictArr.length > 0) {
      var options = []
      for (let i = 0; i < dictArr.length; i++) {
        var optionArr = dictArr[i].split(':')
        if (optionArr[0] === num) {
          return optionArr[1]
        }
      }
      return options
    } else {
      return ''
    }
  } else {
    return ''
  }
}

/**
 * 根据数据字典列表中的名称，获取数据字典的num值
 * @param {string} str
 * @param {string} name
 * @returns {string}
 */
export function getDictNum(str, name) {
  if (str) {
    var dictArr = str.split(',')
    if (dictArr.length > 0) {
      var options = ''
      for (let i = 0; i < dictArr.length; i++) {
        var optionArr = dictArr[i].split(':')
        if (optionArr[1] === name) {
          return optionArr[0]
        }
      }
      return options
    } else {
      return ''
    }
  } else {
    return ''
  }
}

/**
 * 根据权限的url地址判断权限
 * @param {string} url
 * @returns {boolean}
 */
export function isPermissions(permissions, url) {
  return permissions && permissions.toString().indexOf(url) >= 0
}

// uuid 生产器
export function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
