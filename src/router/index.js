import Vue from 'vue'
import Router from 'vue-router'
import { createListView } from '../views/CreateListView'
import ItemView from '../views/ItemView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {path: '/top/:page(\\d+)?', component: createListView('top')},
    { path: '/new/:page(\\d+)?', component: createListView('new') },
    { path: '/show/:page(\\d+)?', component: createListView('show') },
    { path: '/ask/:page(\\d+)?', component: createListView('ask') },
    {path: '/item/:id(\\d+)', component: ItemView},
    {path: '/', redirect: '/top'}
  ]
})
