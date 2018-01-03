<template>
  <div class="voez-announcement">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="news of list">
          <div class="voez-announcement-news" v-html="lineToP(news.content)">
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>
<script>
  import Swiper from 'swiper'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        swiper: null
      }
    },
    computed: {
      ...mapGetters({
        list: 'announcements'
      })
    },
    methods: {
      lineToP (content) {
        let ps = content.split('\\n')
        return ps.map(line => `<p>${line}</p>`).join('')
      },
      initSwiper () {
        this.swiper = new Swiper('.swiper-container', {
          direction: 'horizontal',
          speed: 1000,
          autoplay: 3000,
          grabCursor: true,
          loop: this.list.length > 1,
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets'
          },
          lazyLoading: true
        })
      },
      destroySwiper () {
        this.swiper && this.swiper.destroy()
      }
    },
    watch: {
      list (val) {
        if (!this.$el) {
          return
        }
        this.$nextTick(() => {
          this.destroySwiper()
          this.initSwiper()
        })
      }
    },
    ready () {
      this.destroySwiper()
      this.initSwiper()
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../../node_modules/swiper/dist/css/swiper.min.css';

  .voez-announcement {

    .swiper-container {
      background-image: url("http://voez.sevenoutman.com/assets/bg_announcement.jpg");
      background-size: cover;
    }

    .swiper-slide {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 56.25%;
    }
    .voez-announcement-news {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      transform: translate3d(0, -50%, 0);
      min-height: 120px;
      font-size: 12px;
      padding: 10px 15px;
      box-sizing: border-box;
      color: #6869a1;
    }

    .swiper-pagination {
      width: auto;
      left: auto;
      right: 15px;
      .swiper-pagination-bullet {
        width: 4px;
        height: 4px;
        border-radius: 0;
        border: 2px solid #6869a1;
        transform: rotate(45deg);
        background-color: transparent;
        opacity: 1;
        &.swiper-pagination-bullet-active {
          background-color: #6869a1;
        }
      }

    }
  }

</style>
