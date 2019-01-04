/*
source ABCD
target BECA

L1 N0 ABCD
L1 N1 AEBCD
L1 N3 AEBCD
L2 N4 DBECA
L2 N5 BECA
*/

// 参考了 React 的实现 方便大家进行

const preveChildren = [{ key: 'A' }, { key: 'B' }, { key: 'C' }, { key: 'D' }]
const nextChildren = [{ key: 'B' }, { key: 'E' }, { key: 'C' }, { key: 'A' }]

// 数组内容交换
function move(arr, sourceIdx, toIdx) {
  const tmp = arr[sourceIdx]
  arr[sourceIdx] = arr[toIdx]
  arr[toIdx] = tmp
}

function updateChildren(preventChildrenElements, nextChildrenElements) {
  preventChildrenElements.map((v, i) => (v._mountIndex = i))
  let lastIndex = 0
  let nextIndex = 0
  var name
  for (name in nextChildrenElements) {
    let preveChild = preventChildrenElements[name]
    let nextChild = nextChildrenElements[name]

    // 如果找到匹配 进行移动 这里将 KEY 作为是否相同的真正标识 实际上会复杂一些
    if (preveChild.key === nextChild.key) {
      // 如果老元素的挂载下标小于 lastIndex 那么就进行交换 注意这里用了 nextIndex
      if (preveChild._mountIndex < lastIndex) {
        move(preventChildrenElements, preveChild._mountIndex, nextIndex)
      }
      lastIndex = Math.max(preveChild._mountIndex, lastIndex)
      preveChild._mountIndex = lastIndex
    } else {
      if (preveChild) {
        // 在同样的位置找到了老版的子元素 但是并不一样 有点类似 if else 的两个不相容元素 所以老板的子元素需要被摧毁
        lastIndex = Math.max(preveChild._mountIndex, lastIndex)
        // 这里的删除只是模拟效果
        preventChildrenElements.splice(lastIndex, 1)
      }
      // 无论如何 只要不匹配 新建立的元素需要被加入到老的列表中
      nextChild._mountIndex = nextIndex
      preventChildrenElements.splice(nextIndex, nextChild)
    }
    nextIndex++
  }
  // 清除那些多余的废弃的 压根没被遍历的节点
  for (name in preveChildren) {
    if (!nextChildren[name]) {
      let index = preveChildren.findIndex(v => v.key === name)
      preventChildrenElements.splice(index, 1)
    }
  }
}
