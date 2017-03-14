<template>
  <div class="item-view" v-if="item">
    <template v-if="item">
      <div class="item-view-header">
        <a :href="item.url" target="_blank">
          <h1>{{ item.title }}</h1>
        </a>
        <span v-if="item.url" class="host">
          ({{ item.url | host }})
        </span>
        <div v-if="item.text" v-html="item.text" class="text">
        </div>
        <p class="meta">
          {{ item.score }} points
          {{ item.time | timeAgo }} ago
        </p>
      </div>
      <div class="item-view-comments">
        <p class="item-view-comments-header">
          {{ item.kids ? item.descendants + ' comments' : 'No comments yet.'}}
          <spinner :show="loading"></spinner>
        </p>
        <ul v-if="!loading" class="comment-children">
          <comment v-for="kid in item.kids" :key="kid.id" :id="kid.id" :comment="kid"></comment>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import Spinner from '../components/Spinner.vue'
import Comment from '../components/Comment.vue'

export default {
  name: 'item-view',
  components: { Spinner, Comment },
  data () {
    return {
      loading: true,
      item: {}
    }
  },
  computed: {
  },
  methods: {
    fetchItem: {
    }
  },
  // on the server, only fetch the item itself
  // preFetch: fetchItem,
  // on the client, fetch everything
  beforeMount () {
    const id = this.$route.params.id || 0

    this.loading = true

    let xhr = new XMLHttpRequest()
    let that = this
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        let response = JSON.parse(this.responseText)
        that.item = (response.data.hn.item || {})
        that.loading = false
      }
    })

    let queryData = `{"query":"{ hn { item(id:${id}){ id, type, time, score, title, text, url, descendants, kids { id, time, text, kids{id}}}}}"}`
    xhr.open('POST', 'https://www.graphqlhub.com/graphql', true)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.send(queryData)
  }
}
</script>

<style>
  .item-view-header {
	background-color: #fff;
	padding: 1.8em 2em 1em;
	box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.item-view-header h1 {
	display: inline;
	font-size: 1.5em;
	margin: 0;
	margin-right: 0.5em;
}

.item-view-header .host,
.item-view-header .meta,
.item-view-header .meta a {
	color: #999;
}

.item-view-header .meta a {
	text-decoration: underline;
}

.item-view-comments {
	background-color: #fff;
	margin-top: 10px;
	padding: 0 2em 0.5em;
}

.item-view-comments-header {
	margin: 0;
	font-size: 1.1em;
	padding: 1em 0;
	position: relative;
}

.item-view-comments-header .spinner {
	position: absolute;
	top: 0;
	right: 0;
	bottom: auto;
}

.comment-children {
	list-style-type: none;
	padding: 0;
	margin: 0;
}

@media (max-width: 600px) {
	.item-view-header h1 {
		font-size: 1.25em;
	}
}
</style>
