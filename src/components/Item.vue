<template>
<li class="news-item">
  <span class="score">{{ item.score }}</span>
  <span class="title">
      <template v-if="item.url">
        <a :href="item.url" target="_blank">{{ item.title }}</a>
        <span class="host"> ({{ item.url | host }})</span>
  <!-- @todo | host filter -->
</template>
      <template v-else>
<router-link :to="'/item/' + item.id">
  {{ item.title }}</router-link>
</template>
    </span>
    <br>
    <span class="meta">
      <span class="time">
        {{ item.time | timeAgo }} ago <!-- @todo | timeAgo filter -->
      </span>
      <span v-if="item.type !== 'job'" class="comments-link">
        | <router-link :to="'/item/' + item.id">{{ item.descendants }} comments</router-link>
      </span>
    </span>
    <span class="label" v-if="item.type !== 'story'">{{ item.type }}</span>
  </li>
</template>

<style>
.news-item {
  background-color: #282c2e;
  padding: 20px 30px 20px 80px;
  border-bottom: 1px solid #4c5357;
  position: relative;
  line-height: 20px;
  list-style: none;
}

.news-item .score {
  color: #f60;
  font-size: 1.1em;
  font-weight: 700;
  position: absolute;
  top: 50%;
  left: 0;
  width: 80px;
  text-align: center;
  margin-top: -10px;
}

.news-item .meta,
.news-item .host {
  font-size: 0.85em;
  color: #999;
}

.news-item .meta a,
.news-item .host a {
  color: #999;
  text-decoration: underline;
}

.news-item .meta a:hover,
.news-item .host a:hover {
  color: #f60;
}

.title a{
color: #F2F2F2
}
</style>

<script>
export default {
  name: 'news-item',
  props: ['item']
}
</script>
