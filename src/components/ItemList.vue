<template>
  <div class='news-view'>
    <spinner :show="loading"></spinner>
    <div class='news-list'>
      <item v-for='item in displayedItems' :key='item.id' :item='item'>
      </item>
    </div>

  </div>
</template>

<style>
.news-view {
  padding-top: 20px;
}

.news-list-nav,
.news-list {
  background-color: #fff;
  border-radius: 2px;
}

.news-list-nav {
  padding: 15px 30px;
  position: fixed;
  text-align: center;
  top: 55px;
  left: 0;
  right: 0;
  z-index: 998;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.news-list-nav a {
  margin: 0 1em;
}

.news-list-nav .disabled {
  color: #ccc;
}

.news-list {
  position: absolute;
  margin: 30px 0;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.news-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(30px, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}

.item-move,
.item-enter-active,
.item-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.item-enter {
  opacity: 0;
  transform: translate(30px, 0);
}

.item-leave-active {
  position: absolute;
  opacity: 0;
  transform: translate(30px, 0);
}

@media (max-width: 600px) {
  .news-list {
    margin: 10px 0;
  }
}


</style>

<script>
import Item from './Item.vue'
import Spinner from './Spinner.vue'

export default {
  name: 'item-list',
  components: {
    Item,
    Spinner
  },
  props: {
    type: String
  },
  data () {
    // this.loading = true
    // let data = this.getList(this.type)
    // this.loading = false
    return {
      loading: true,
      displayedItems: []
    }
  },
  methods: {
    getList (listName) {
      let story = `${listName}Stories`
      this.loading = true
      let xhr = new XMLHttpRequest()
      let that = this
      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          let response = JSON.parse(this.responseText)
          that.displayedItems = (response.data.hn[story] || [])
          that.loading = false
        }
      })

      let queryData = `{"query":"{hn {${story}(limit: 20, offset: 0) {id, score, title, url, time, type, descendants}}}"}`
      xhr.open('POST', 'https://www.graphqlhub.com/graphql', true)
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send(queryData)
    }
  },
  mounted () {
    this.getList(this.type)
  }
}

</script>
