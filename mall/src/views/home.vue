<template>
  <div style="height: 300px">
    <Carousel
      autoplay loop
      :autoplay-speed="3000"
      arrow="always"
      dots="outside"
      v-model="value1">
        <Carousel-item>
            <div class="demo-carousel">
              <img class="demo-img" src="https://desk-fd.zol-img.com.cn/t_s1440x900c5/g5/M00/01/0E/ChMkJlbKweuIY1UrAAH5bG6gbQ8AALGgABP7P8AAfmE137.jpg" />
            </div>
        </Carousel-item>
        <Carousel-item>
            <div class="demo-carousel">
              <img class="demo-img" src="https://desk-fd.zol-img.com.cn/t_s1600x900c5/g5/M00/01/0E/ChMkJ1bKweuIQlcQAAE324CtS_gAALGgAA0QrYAATfz417.jpg" />
            </div>
        </Carousel-item>
        <Carousel-item>
            <div class="demo-carousel">
              <img class="demo-img" src="https://desk-fd.zol-img.com.cn/t_s1440x900c5/g5/M00/01/0E/ChMkJlbKweuIZp8HAAI8zVXoIfAAALGgAA67WcAAjzl702.jpg" />
            </div>
        </Carousel-item>
        <Carousel-item>
            <div class="demo-carousel">
              <img class="demo-img" src="https://desk-fd.zol-img.com.cn/t_s1440x900c5/g5/M00/01/0E/ChMkJ1bKweuIdLkyAANw0X0weRcAALGgABSD-sAA3Dp650.jpg">
            </div>
        </Carousel-item>
    </Carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-img {
  width: 100%;
  height: 700px;
}
</style>
