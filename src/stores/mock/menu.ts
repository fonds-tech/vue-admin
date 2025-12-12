/**
 * 模拟菜单数据
 * 根据用户角色返回不同的菜单配置
 */
import type { BackendMenu } from "../permission/interface"

/**
 * Admin 用户菜单 - 完整权限
 * 包含所有系统管理功能和高级功能
 */
export const adminMenus: BackendMenu[] = [
  // 仪表盘
  {
    id: 1,
    parentId: 0,
    path: "/dashboard",
    name: "Dashboard",
    component: "Layout",
    redirect: "/dashboard/analysis",
    meta: {
      title: "仪表盘",
      icon: "Odometer",
    },
    children: [
      {
        id: 11,
        parentId: 1,
        path: "analysis",
        name: "Analysis",
        component: "dashboard/analysis/index",
        meta: {
          title: "分析页",
          icon: "TrendCharts",
        },
      },
      {
        id: 12,
        parentId: 1,
        path: "workbench",
        name: "Workbench",
        component: "dashboard/workbench/index",
        meta: {
          title: "工作台",
          icon: "Monitor",
        },
      },
    ],
  },
  // 系统管理
  {
    id: 2,
    parentId: 0,
    path: "/system",
    name: "System",
    component: "Layout",
    redirect: "/system/user",
    meta: {
      title: "系统管理",
      icon: "Setting",
    },
    children: [
      {
        id: 21,
        parentId: 2,
        path: "user",
        name: "SystemUser",
        component: "system/user/index",
        meta: {
          title: "用户管理",
          icon: "User",
          permissions: ["system:user:list"],
        },
      },
      {
        id: 22,
        parentId: 2,
        path: "role",
        name: "SystemRole",
        component: "system/role/index",
        meta: {
          title: "角色管理",
          icon: "UserFilled",
          permissions: ["system:role:list"],
        },
      },
      {
        id: 23,
        parentId: 2,
        path: "menu",
        name: "SystemMenu",
        component: "system/menu/index",
        meta: {
          title: "菜单管理",
          icon: "Menu",
          permissions: ["system:menu:list"],
        },
      },
      {
        id: 24,
        parentId: 2,
        path: "dept",
        name: "SystemDept",
        component: "system/dept/index",
        meta: {
          title: "部门管理",
          icon: "OfficeBuilding",
          permissions: ["system:dept:list"],
        },
      },
      {
        id: 25,
        parentId: 2,
        path: "dict",
        name: "SystemDict",
        component: "system/dict/index",
        meta: {
          title: "字典管理",
          icon: "Collection",
          permissions: ["system:dict:list"],
        },
      },
    ],
  },
  // 系统监控
  {
    id: 3,
    parentId: 0,
    path: "/monitor",
    name: "Monitor",
    component: "Layout",
    redirect: "/monitor/online",
    meta: {
      title: "系统监控",
      icon: "DataLine",
      roles: ["admin"],
    },
    children: [
      {
        id: 31,
        parentId: 3,
        path: "online",
        name: "OnlineUser",
        component: "monitor/online/index",
        meta: {
          title: "在线用户",
          icon: "Connection",
        },
      },
      {
        id: 32,
        parentId: 3,
        path: "log",
        name: "OperationLog",
        component: "monitor/log/index",
        meta: {
          title: "操作日志",
          icon: "Document",
        },
      },
      {
        id: 33,
        parentId: 3,
        path: "server",
        name: "ServerInfo",
        component: "monitor/server/index",
        meta: {
          title: "服务监控",
          icon: "Cpu",
        },
      },
    ],
  },
  // 组件示例
  {
    id: 4,
    parentId: 0,
    path: "/components",
    name: "Components",
    component: "Layout",
    redirect: "/components/table",
    meta: {
      title: "组件示例",
      icon: "Grid",
    },
    children: [
      {
        id: 41,
        parentId: 4,
        path: "table",
        name: "TableDemo",
        component: "components/table/index",
        meta: {
          title: "表格组件",
          icon: "Grid",
        },
      },
      {
        id: 42,
        parentId: 4,
        path: "form",
        name: "FormDemo",
        component: "components/form/index",
        meta: {
          title: "表单组件",
          icon: "Edit",
        },
      },
      {
        id: 43,
        parentId: 4,
        path: "editor",
        name: "EditorDemo",
        component: "components/editor/index",
        meta: {
          title: "富文本编辑器",
          icon: "Document",
        },
      },
      {
        id: 44,
        parentId: 4,
        path: "upload",
        name: "UploadDemo",
        component: "components/upload/index",
        meta: {
          title: "上传组件",
          icon: "Upload",
        },
      },
    ],
  },
  // 多级菜单示例
  {
    id: 5,
    parentId: 0,
    path: "/nested",
    name: "Nested",
    component: "Layout",
    redirect: "/nested/menu1/menu1-1",
    meta: {
      title: "多级菜单",
      icon: "Operation",
    },
    children: [
      {
        id: 51,
        parentId: 5,
        path: "menu1",
        name: "Menu1",
        component: "nested/menu1/index",
        redirect: "/nested/menu1/menu1-1",
        meta: {
          title: "菜单1",
        },
        children: [
          {
            id: 511,
            parentId: 51,
            path: "menu1-1",
            name: "Menu1-1",
            component: "nested/menu1/menu1-1/index",
            meta: {
              title: "菜单1-1",
            },
          },
          {
            id: 512,
            parentId: 51,
            path: "menu1-2",
            name: "Menu1-2",
            component: "nested/menu1/menu1-2/index",
            meta: {
              title: "菜单1-2",
            },
          },
        ],
      },
      {
        id: 52,
        parentId: 5,
        path: "menu2",
        name: "Menu2",
        component: "nested/menu2/index",
        meta: {
          title: "菜单2",
        },
      },
    ],
  },
  // 个人中心
  {
    id: 8,
    parentId: 0,
    path: "/profile",
    name: "Profile",
    component: "Layout",
    redirect: "/profile/index",
    meta: {
      title: "个人中心",
      icon: "Avatar",
    },
    children: [
      {
        id: 81,
        parentId: 8,
        path: "index",
        name: "ProfileIndex",
        component: "profile/index",
        meta: {
          title: "个人信息",
          icon: "User",
        },
      },
      {
        id: 82,
        parentId: 8,
        path: "password",
        name: "ProfilePassword",
        component: "profile/password/index",
        meta: {
          title: "修改密码",
          icon: "Key",
        },
      },
    ],
  },
  // 关于
  {
    id: 7,
    parentId: 0,
    path: "/about",
    name: "About",
    component: "Layout",
    redirect: "/about/index",
    meta: {
      title: "关于",
      icon: "InfoFilled",
    },
    children: [
      {
        id: 71,
        parentId: 7,
        path: "index",
        name: "AboutIndex",
        component: "about/index",
        meta: {
          title: "关于项目",
          icon: "InfoFilled",
        },
      },
    ],
  },
]

/**
 * 普通用户菜单 - 受限权限
 * 只包含基础功能，不含系统管理和监控
 */
export const userMenus: BackendMenu[] = [
  // 仪表盘（简化版）
  {
    id: 1,
    parentId: 0,
    path: "/dashboard",
    name: "Dashboard",
    component: "Layout",
    redirect: "/dashboard/workbench",
    meta: {
      title: "仪表盘",
      icon: "Odometer",
    },
    children: [
      {
        id: 12,
        parentId: 1,
        path: "workbench",
        name: "Workbench",
        component: "dashboard/workbench/index",
        meta: {
          title: "工作台",
          icon: "Monitor",
        },
      },
    ],
  },
  // 组件示例（部分）
  {
    id: 4,
    parentId: 0,
    path: "/components",
    name: "Components",
    component: "Layout",
    redirect: "/components/table",
    meta: {
      title: "组件示例",
      icon: "Grid",
    },
    children: [
      {
        id: 41,
        parentId: 4,
        path: "table",
        name: "TableDemo",
        component: "components/table/index",
        meta: {
          title: "表格组件",
          icon: "Grid",
        },
      },
      {
        id: 42,
        parentId: 4,
        path: "form",
        name: "FormDemo",
        component: "components/form/index",
        meta: {
          title: "表单组件",
          icon: "Edit",
        },
      },
    ],
  },
  // 个人中心
  {
    id: 8,
    parentId: 0,
    path: "/profile",
    name: "Profile",
    component: "Layout",
    redirect: "/profile/index",
    meta: {
      title: "个人中心",
      icon: "Avatar",
    },
    children: [
      {
        id: 81,
        parentId: 8,
        path: "index",
        name: "ProfileIndex",
        component: "profile/index",
        meta: {
          title: "个人信息",
          icon: "User",
        },
      },
      {
        id: 82,
        parentId: 8,
        path: "password",
        name: "ProfilePassword",
        component: "profile/password/index",
        meta: {
          title: "修改密码",
          icon: "Key",
        },
      },
    ],
  },
  // 关于
  {
    id: 7,
    parentId: 0,
    path: "/about",
    name: "About",
    component: "Layout",
    redirect: "/about/index",
    meta: {
      title: "关于",
      icon: "InfoFilled",
    },
    children: [
      {
        id: 71,
        parentId: 7,
        path: "index",
        name: "AboutIndex",
        component: "about/index",
        meta: {
          title: "关于项目",
          icon: "InfoFilled",
        },
      },
    ],
  },
]

/**
 * 根据用户名获取对应的菜单数据
 * @param username 用户名
 * @returns 菜单数据
 */
export function getMenusByUsername(username: string): BackendMenu[] {
  // admin 用户返回完整菜单
  if (username === "admin") {
    return adminMenus
  }
  // 其他用户返回普通用户菜单
  return userMenus
}

/**
 * 模拟用户数据
 */
export const mockUsers = {
  admin: {
    id: 1,
    username: "admin",
    nickname: "超级管理员",
    avatar: "",
    email: "admin@example.com",
    phone: "13800138000",
    roles: ["admin"],
    permissions: ["*"],
  },
  user: {
    id: 2,
    username: "user",
    nickname: "普通用户",
    avatar: "",
    email: "user@example.com",
    phone: "13800138001",
    roles: ["user"],
    permissions: [
      "dashboard:view",
      "components:table:view",
      "components:form:view",
      "profile:view",
      "profile:edit",
    ],
  },
} as const

/**
 * 根据用户名获取用户信息
 * @param username 用户名
 * @returns 用户信息
 */
export function getMockUserByUsername(username: string) {
  if (username === "admin") {
    return mockUsers.admin
  }
  return mockUsers.user
}
