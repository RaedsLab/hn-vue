<template>
  <li v-if="comment" class="comment">
    <div class="by">
      {{ comment.time | timeAgo }} ago
    </div>
    <div class="text" v-html="comment.text"></div>
    <div class="toggle" :class="{ open }" v-if="comment.kids && comment.kids.length">
      <a @click="open = !open; getChildren()">{{
        open
        ? '[-]'
        : '[+] ' + pluralize(comment.kids.length) + ' collapsed'
        }}</a>
    </div>
    <ul class="comment-children" v-show="open">
      <comment v-for="kid in comment.kids" :key="kid.id" :id="kid.id" :comment="kid"></comment>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'comment',
  props: ['id', 'comment'],
  data () {
    return {
      kids: [],
      open: false,
      loaded: false
    }
  },
  computed: {
  },
  methods: {
    pluralize: n => n + (n === 1 ? ' reply' : ' replies'),
    getChildren () {
      this.loaded = false
      this.comment.kids.map(kid => {
        console.log(JSON.stringify(kid))

        let xhr = new XMLHttpRequest()
        let that = this
        xhr.addEventListener('readystatechange', function () {
          if (this.readyState === 4) {
            let response = JSON.parse(this.responseText)

            that.comment.kids.splice(that.comment.kids.indexOf(kid), 1)
            that.comment.kids.push(response.data.hn.item)
            this.loaded = true
          }
        })

        let queryData = `{"query":"{ hn { item(id:${kid.id}){ id, type, time, score, title, text, url, descendants, kids { id, time, text, kids{id}}}}}"}`
        xhr.open('POST', 'https://www.graphqlhub.com/graphql', true)
        xhr.setRequestHeader('content-type', 'application/json')
        xhr.send(queryData)
      })

      console.log('kids')
      console.log(this.kids)
    }
  }
}
</script>

<style>
  .comment-children .comment-children {
    margin-left: 1.5em;
  }

  .comment {
    border-top: 1px solid #eee;
    position: relative;
  }

  .comment .by,
  .comment .text,
  .comment .toggle {
    font-size: 0.9em;
    margin: 1em 0;
  }

  .comment .by {
    color: #999;
  }

  .comment .by a {
    color: #999;
    text-decoration: underline;
  }

  .comment .text {
    overflow-wrap: break-word;
  }

  .comment .text a:hover {
    color: #f60;
  }

  .comment .text pre {
    white-space: pre-wrap;
  }

  .comment .toggle {
    background-color: #fffbf2;
    padding: 0.3em 0.5em;
    border-radius: 4px;
  }

  .comment .toggle a {
    color: #999;
    cursor: pointer;
  }

  .comment .toggle.open {
    padding: 0;
    background-color: transparent;
    margin-bottom: -0.5em;
  }
</style>
