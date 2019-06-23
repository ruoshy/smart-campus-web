import Vue from 'vue'
import Router from 'vue-router'
import Login from '../login/Login'
import Index from '../index/Index'
import SchoolProfile from '../index/assembly/admin/SchoolProfile'
import Department from '../index/assembly/admin/Department'
import Classroom from '../index/assembly/admin/Classroom'
import Classs from '../index/assembly/admin/Classs'
import Student from '../index/assembly/admin/Student'
import Teacher from '../index/assembly/admin/Teacher'
import NewsManage from '../index/assembly/admin/NewsManage'
import NewsSend from '../index/assembly/admin/NewsSend'
import CourseTable from '../index/assembly/admin/CourseTable'
import Major from '../index/assembly/admin/Major'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children: [
        // 基本信息
        {
          path: '/',
          name: 'SchoolProfile',
          component: SchoolProfile
        },
        {
          path: '/dep',
          name: 'Department',
          component: Department
        },
        {
          path: '/clasrom',
          name: 'Classroom',
          component: Classroom
        },
        {
          path: '/classs',
          name: 'Classs',
          component: Classs
        },
        {
          path: '/major',
          name: 'Major',
          component: Major
        },
        // 账户管理
        {
          path: '/tec',
          name: 'Teacher',
          component: Teacher
        },
        {
          path: '/stu',
          name: 'Student',
          component: Student
        },
        // 新闻管理
        {
          path: '/newmg',
          name: 'NewsManage',
          component: NewsManage
        },
        {
          path: '/newsd',
          name: 'NewsSend',
          component: NewsSend
        },
        {
          path: '/custab',
          name: 'CourseTable',
          component: CourseTable
        }
        // 课程管理

      ]
    }

  ]
})
