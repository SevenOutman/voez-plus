<template>
  <cell
    class="vplus-leaderboard-item"
    :class="{ self: isSelf }"
    :title="title"
    @click="toggleDisplayMode"
  >
    <span slot="icon">{{ rank }}</span>

    <span :class="{ fc: item.fc, ap: item.ap }" v-show="displayMode == 'score'"
          slot="value">{{ item.score }}</span>

    <div class="vplus-leaderboard-notes" :class="{ expanded: displayMode == 'notes' }" v-if="!!item.notes"
         slot="child">
      <!--<span class="vplus-leaderboard-notes-mp">max perfect {{ item.notes.mp }}</span>-->
      <span class="vplus-leaderboard-notes-perfect">perfect <span>{{ item.notes.perfect }}</span></span>
      <span class="vplus-leaderboard-notes-ok">ok <span>{{ item.notes.ok }}</span></span>
      <span class="vplus-leaderboard-notes-miss">miss <span>{{ item.notes.miss }}</span></span>
      <!--<span class="vplus-leaderboard-notes-combo">combo {{ item.notes.combo }}</span>-->

    </div>
  </cell>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'

  export default {
    components: {
      Cell
    },
    props: {
      item: Object,
      rank: Number,
      isSelf: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        displayMode: 'score'
      }
    },
    computed: {
      title () {
        return this.item.name
      },
      inlineDesc () {
        if (this.displayMode === 'notes') {
          return this.item.score + ''
        }
        return ''
      }
    },
    methods: {
      toggleDisplayMode () {
        if (this.displayMode === 'score' && !!this.item.notes) {
          this.displayMode = 'notes'
        } else {
          this.displayMode = 'score'
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .vplus-leaderboard-item {
    &.self {
      .weui_cell_hd, .weui_cell_bd p, .weui_cell_ft {
        color: #E13841;
      }
    }
    [slot="after-title"] {
      float: right;
    }

    .fc::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 1px;
      margin: -4px 8px 0;
      transform: rotate(45deg);
      background-color: #34B9F8;
      vertical-align: middle;
      display: inline-block;
    }

    .ap::before {
      background-color: #F8B427;
    }

    .weui_cell_hd {
      width: 2em;
      color: #6869a1;
    }
    .weui_cell_bd {
      p {
        color: #6869a1;
      }
    }
    .weui_cell_ft {
      color: #6869a1;
    }

    .vplus-leaderboard-notes {
      position: absolute;
      top: 0;
      right: 0;

      & > span {
        text-align: right;
        height: 44px / 3;
        line-height: 44px / 3;
        color: #ffffff;
        display: block;
        padding-right: 12px;
        font-size: 0;
        border-right: 3px solid;
        & > span {
          width: 2em;
          display: inline-block;
        }
      }
      &.expanded > span {
        font-size: 14px;
      }
      .vplus-leaderboard-notes-mp {
        /*color: #F1A873;*/
        /*background-color: #FBD741;*/
        border-right-color: #FBD741;
      }
      .vplus-leaderboard-notes-perfect {
        color: #F1A873;
        /*background-color: #F1A873;*/
        border-right-color: #F1A873;

      }
      .vplus-leaderboard-notes-ok {
        color: #50BDEE;
        /*background-color: #50BDEE;*/
        border-right-color: #50BDEE;

      }
      .vplus-leaderboard-notes-miss {
        color: #E8555A;
        /*background-color: #E8555A;*/
        border-right-color: #E8555A;

      }
      .vplus-leaderboard-notes-combo {
        /*color: #F1A873;*/
        background-color: #DD66CF;
        border-right-color: #FBD741;

      }
    }
  }
</style>
