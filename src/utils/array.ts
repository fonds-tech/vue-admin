/**
 * 将扁平列表转换为树形结构
 * @param list 扁平数据列表
 * @param parentKey 父级ID的字段名，默认为 'parentId'
 * @param idKey ID字段名，默认为 'id'
 * @param rootValue 根节点的父级ID值，默认为 0
 * @returns 树形结构数据
 */
export function listToTree<T extends Record<string, any>>(
  list: T[],
  parentKey: keyof T = "parentId" as keyof T,
  idKey: keyof T = "id" as keyof T,
  rootValue: T[keyof T] = 0 as T[keyof T],
): (T & { children?: T[] })[] {
  // 创建id到节点的映射
  const map = new Map<T[keyof T], T & { children?: T[] }>()

  // 复制原始数据，避免修改原数组
  const nodes = list.map((item) => ({ ...item }))

  // 建立映射关系
  nodes.forEach((node) => {
    map.set(node[idKey], node)
  })

  // 构建树形结构
  const tree: (T & { children?: T[] })[] = []

  nodes.forEach((node) => {
    const parentId = node[parentKey]

    if (parentId === rootValue) {
      // 根节点
      tree.push(node)
    }
    else {
      // 子节点，找到父节点并添加到 children
      const parent = map.get(parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(node)
      }
    }
  })

  return tree
}

/**
 * 将树形结构扁平化为列表
 * @param tree 树形结构数据
 * @param childrenKey children字段名，默认为 'children'
 * @returns 扁平化后的列表
 */
export function treeToList<T extends Record<string, any>>(tree: T[], childrenKey: keyof T = "children" as keyof T): T[] {
  const result: T[] = []

  function traverse(nodes: T[]) {
    nodes.forEach((node) => {
      const { [childrenKey]: children, ...rest } = node
      result.push(rest as T)

      if (Array.isArray(children) && children.length > 0) {
        traverse(children)
      }
    })
  }

  traverse(tree)
  return result
}
